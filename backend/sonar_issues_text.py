import os, requests, sys

SONAR_HOST = os.getenv("SONAR_HOST", "http://localhost:9000")
PROJECT_KEY = os.getenv("PROJECT_KEY", "pbo")
BRANCH = os.getenv("BRANCH", "master")
TOKEN = os.environ.get("SONAR_TOKEN")

if not TOKEN:
    print("ERROR: set SONAR_TOKEN dulu", file=sys.stderr)
    sys.exit(1)

s = requests.Session()
s.auth = (TOKEN, "")

def fetch_all():
    all_issues = []
    p, ps, total = 1, 500, 1
    while (p - 1) * ps < total:
        r = s.get(
            f"{SONAR_HOST}/api/issues/search",
            params={
                "componentKeys": PROJECT_KEY,
                "branch": BRANCH,
                "statuses": "OPEN,CONFIRMED,REOPENED",
                "ps": ps,
                "p": p,
            },
            timeout=60,
        )
        r.raise_for_status()
        data = r.json()
        total = data["total"]
        all_issues.extend(data["issues"])
        p += 1
    return all_issues

issues = fetch_all()

for i, it in enumerate(issues, 1):
    sev = it.get("severity", "")
    typ = it.get("type", "")
    msg = (it.get("message") or "").replace("\n", " ").strip()
    comp = it.get("component", "")
    line = it.get("line")
    loc = f"{comp}:{line}" if line else comp
    print(f"{i}. [{typ}/{sev}] {msg} ({loc})")
