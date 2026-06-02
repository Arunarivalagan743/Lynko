const https = require("https");
const net = require("net");
const { env } = require("../config/env");

const BLOCKED_PROTOCOLS = ["javascript:", "data:", "file:", "ftp:"];
const ALLOWED_PROTOCOLS = ["http:", "https:"];

const PRIVATE_IPV4_RANGES = [
	{ start: "10.0.0.0", end: "10.255.255.255" },
	{ start: "127.0.0.0", end: "127.255.255.255" },
	{ start: "169.254.0.0", end: "169.254.255.255" },
	{ start: "172.16.0.0", end: "172.31.255.255" },
	{ start: "192.168.0.0", end: "192.168.255.255" },
	{ start: "0.0.0.0", end: "0.255.255.255" },
];

const ipv4ToLong = (ip) => {
	return ip.split(".").reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
};

const isPrivateIpv4 = (ip) => {
	const value = ipv4ToLong(ip);
	return PRIVATE_IPV4_RANGES.some((range) => {
		const start = ipv4ToLong(range.start);
		const end = ipv4ToLong(range.end);
		return value >= start && value <= end;
	});
};

const isPrivateIpv6 = (ip) => {
	const normalized = ip.toLowerCase();
	return (
		normalized === "::1" ||
		normalized.startsWith("fc") ||
		normalized.startsWith("fd") ||
		normalized.startsWith("fe80")
	);
};

const parseUrl = (input) => {
	return new URL(input);
};

const validateUrlFormat = (input) => {
	const url = parseUrl(input);

	if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
		return {
			isSafe: false,
			threats: [{ reason: "blocked_protocol", source: "local" }],
			source: "local",
			riskLevel: "malicious",
		};
	}

	if (BLOCKED_PROTOCOLS.includes(url.protocol)) {
		return {
			isSafe: false,
			threats: [{ reason: "blocked_protocol", source: "local" }],
			source: "local",
			riskLevel: "malicious",
		};
	}

	return { isSafe: true, threats: [], source: "local", riskLevel: "safe" };
};

const validateHostname = (url) => {
	const hostname = url.hostname.toLowerCase();

	if (!hostname || hostname === "localhost") {
		return {
			isSafe: false,
			threats: [{ reason: "localhost_blocked", source: "local" }],
			source: "local",
			riskLevel: "malicious",
		};
	}

	if (hostname.endsWith(".local") || hostname.endsWith(".internal")) {
		return {
			isSafe: false,
			threats: [{ reason: "internal_hostname", source: "local" }],
			source: "local",
			riskLevel: "malicious",
		};
	}

	if (!hostname.includes(".")) {
		return {
			isSafe: false,
			threats: [{ reason: "invalid_hostname", source: "local" }],
			source: "local",
			riskLevel: "malicious",
		};
	}

	const ipVersion = net.isIP(hostname);
	if (ipVersion === 4 && isPrivateIpv4(hostname)) {
		return {
			isSafe: false,
			threats: [{ reason: "private_ip", source: "local" }],
			source: "local",
			riskLevel: "malicious",
		};
	}

	if (ipVersion === 6 && isPrivateIpv6(hostname)) {
		return {
			isSafe: false,
			threats: [{ reason: "private_ip", source: "local" }],
			source: "local",
			riskLevel: "malicious",
		};
	}

	return { isSafe: true, threats: [], source: "local", riskLevel: "safe" };
};

const httpsRequest = (options, body, timeoutMs = 5000) => {
	return new Promise((resolve, reject) => {
		const controller = new AbortController();
		const timeout = setTimeout(() => {
			controller.abort();
		}, timeoutMs);

		const req = https.request({ ...options, signal: controller.signal }, (res) => {
			let data = "";
			res.on("data", (chunk) => {
				data += chunk;
			});
			res.on("end", () => {
				clearTimeout(timeout);
				resolve({ statusCode: res.statusCode, body: data });
			});
		});

		req.on("error", (err) => {
			clearTimeout(timeout);
			reject(err);
		});
		if (body) {
			req.write(body);
		}
		req.end();
	});
};

const classifySafeBrowsingFailure = (statusCode, body, err) => {
	if (err) {
		const code = err.code || "";
		if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
			return "dns_failure";
		}
		if (code === "ECONNREFUSED" || code === "ECONNRESET" || code === "ENETUNREACH") {
			return "network_failure";
		}
		if (err.name === "AbortError" || code === "ABORT_ERR") {
			return "timeout";
		}
	}

	if (statusCode === 429) {
		return "quota_exceeded";
	}

	if (statusCode === 401) {
		return "invalid_api_key";
	}

	if (statusCode === 403 && body) {
		const lowered = String(body).toLowerCase();
		if (lowered.includes("api key not valid") || lowered.includes("api_key_invalid")) {
			return "invalid_api_key";
		}
		if (lowered.includes("accessnotconfigured") || lowered.includes("api has not been used")) {
			return "api_not_enabled";
		}
		if (lowered.includes("quota") || lowered.includes("resource_exhausted")) {
			return "quota_exceeded";
		}
	}

	return "unknown";
};

const checkSafeBrowsing = async (url) => {
	if (!env.safeBrowsingApiKey) {
		return { isSafe: true, threats: [], source: "safe_browsing", riskLevel: "safe" };
	}

	const requestPath = "/v4/threatMatches:find?key=REDACTED";
	console.warn("[safe_browsing] key_loaded=%s", Boolean(env.safeBrowsingApiKey));
	console.warn("[safe_browsing] request_url=https://%s%s", "safebrowsing.googleapis.com", requestPath);

	const payload = JSON.stringify({
		client: { clientId: "lynko", clientVersion: "1.0" },
		threatInfo: {
			threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
			platformTypes: ["ANY_PLATFORM"],
			threatEntryTypes: ["URL"],
			threatEntries: [{ url }],
		},
	});

	let response;
	try {
		response = await httpsRequest(
			{
				method: "POST",
				hostname: "safebrowsing.googleapis.com",
				path: `/v4/threatMatches:find?key=${env.safeBrowsingApiKey}`,
				headers: {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(payload),
				},
			},
			payload
		);
	} catch (err) {
		const classification = classifySafeBrowsingFailure(null, null, err);
		console.warn("[safe_browsing] request_error=%s code=%s", classification, err.code || "unknown");
		throw err;
	}

	console.warn("[safe_browsing] status_code=%s", response.statusCode);
	console.warn("[safe_browsing] response_body=%s", response.body || "");

	if (response.statusCode !== 200) {
		const classification = classifySafeBrowsingFailure(response.statusCode, response.body, null);
		console.warn("[safe_browsing] failure_classification=%s", classification);
		return {
			isSafe: false,
			threats: [{ reason: "safe_browsing_unavailable", source: "safe_browsing" }],
			source: "safe_browsing",
			riskLevel: "suspicious",
		};
	}

	let data = {};
	if (response.body) {
		try {
			data = JSON.parse(response.body);
		} catch (_err) {
			return {
				isSafe: false,
				threats: [{ reason: "safe_browsing_parse_error", source: "safe_browsing" }],
				source: "safe_browsing",
				riskLevel: "suspicious",
			};
		}
	}
	if (data.matches && data.matches.length) {
		return {
			isSafe: false,
			threats: data.matches.map((match) => ({
				reason: match.threatType || "threat",
				source: "safe_browsing",
			})),
			source: "safe_browsing",
			riskLevel: "malicious",
		};
	}

	return { isSafe: true, threats: [], source: "safe_browsing", riskLevel: "safe" };
};

const encodeVirusTotalUrl = (url) => {
	return Buffer.from(url).toString("base64").replace(/=+$/, "");
};

const checkVirusTotal = async (url) => {
	if (!env.virusTotalApiKey) {
		return { isSafe: true, threats: [], source: "virustotal", riskLevel: "safe" };
	}

	const requestPath = "/api/v3/urls/{encoded}";
	console.warn("[virustotal] key_loaded=%s", Boolean(env.virusTotalApiKey));
	console.warn("[virustotal] request_url=https://%s%s", "www.virustotal.com", requestPath);

	const encoded = encodeVirusTotalUrl(url);
	const response = await httpsRequest({
		method: "GET",
		hostname: "www.virustotal.com",
		path: `/api/v3/urls/${encoded}`,
		headers: {
			"x-apikey": env.virusTotalApiKey,
		},
	});

	console.warn("[virustotal] status_code=%s", response.statusCode);
	console.warn("[virustotal] response_body=%s", response.body || "");

	if (response.statusCode === 404) {
		return { isSafe: true, threats: [], source: "virustotal", riskLevel: "safe" };
	}

	if (response.statusCode !== 200) {
		return {
			isSafe: false,
			threats: [{ reason: "virustotal_unavailable", source: "virustotal" }],
			source: "virustotal",
			riskLevel: "suspicious",
		};
	}

	let data = {};
	if (response.body) {
		try {
			data = JSON.parse(response.body);
		} catch (_err) {
			return {
				isSafe: false,
				threats: [{ reason: "virustotal_parse_error", source: "virustotal" }],
				source: "virustotal",
				riskLevel: "suspicious",
			};
		}
	}
	const stats = data?.data?.attributes?.last_analysis_stats || {};
	const malicious = Number(stats.malicious || 0);
	const suspicious = Number(stats.suspicious || 0);

	if (malicious > 0 || suspicious > 0) {
		return {
			isSafe: false,
			threats: [
				{
					reason: malicious > 0 ? "malicious" : "suspicious",
					source: "virustotal",
				},
			],
			source: "virustotal",
			riskLevel: malicious > 0 ? "malicious" : "suspicious",
		};
	}

	return { isSafe: true, threats: [], source: "virustotal", riskLevel: "safe" };
};

const validateUrlSafety = async (input) => {
	let url;
	try {
		url = parseUrl(input);
	} catch (_err) {
		return {
			isSafe: false,
			threats: [{ reason: "invalid_url", source: "local" }],
			source: "local",
			riskLevel: "malicious",
		};
	}

	const formatCheck = validateUrlFormat(input);
	if (!formatCheck.isSafe) {
		return formatCheck;
	}

	const hostnameCheck = validateHostname(url);
	if (!hostnameCheck.isSafe) {
		return hostnameCheck;
	}

	const safeBrowsingResult = await checkSafeBrowsing(url.href);
	if (!safeBrowsingResult.isSafe) {
		return safeBrowsingResult;
	}

	const virusTotalResult = await checkVirusTotal(url.href);
	if (!virusTotalResult.isSafe) {
		return virusTotalResult;
	}

	return { isSafe: true, threats: [], source: "combined", riskLevel: "safe" };
};

module.exports = {
	validateUrlSafety,
};
