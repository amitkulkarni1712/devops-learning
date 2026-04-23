/* eslint-disable */
import { useState, useEffect } from "react";

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#080C10;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#0D1117;} ::-webkit-scrollbar-thumb{background:#00FFB2;}
  .wk,.ph{transition:all .18s;cursor:pointer;border:1px solid #1A2030;}
  .wk:hover,.ph:hover{border-color:#00FFB2!important;transform:translateY(-1px);}
  .wk.on,.ph.on{border-color:#00FFB2!important;}
  .tb,.itb,.ntb{background:none;border:none;cursor:pointer;transition:opacity .12s;}
  .tb:hover,.itb:hover,.ntb:hover{opacity:.75;}
  .bar{transition:width 1.1s ease;}
  .rl{text-decoration:none;transition:transform .13s;display:block;}
  .rl:hover{transform:translateX(3px);}
  .fb,.sc,.chk{cursor:pointer;transition:all .13s;border-radius:3px;}
  .fb:hover{opacity:.8;} .sc:hover{opacity:.8;}
  .di::before{content:"✗ ";color:#FF4444;}
`;

// ─── SHARED UTILS ─────────────────────────────────────────────────────────────
const SMETA = {
  not_started:{label:"Not Started",color:"#1A2030",tc:"#4A5568",dot:"○"},
  in_progress:{label:"In Progress",color:"#FF6B3520",tc:"#FF6B35",dot:"◑"},
  done:{label:"Complete",color:"#00FFB220",tc:"#00FFB2",dot:"●"}
};
const RMETA = {
  docs:{icon:"⬡",label:"DOCS",color:"#00FFB2"},
  course:{icon:"◈",label:"COURSE",color:"#A855F7"},
  video:{icon:"▶",label:"VIDEO",color:"#FF6B35"},
  book:{icon:"◆",label:"BOOK",color:"#FACC15"},
  repo:{icon:"◉",label:"REPO",color:"#38BDF8"}
};

function CodeBlock({content,lang}){
  const [copied,setCopied]=useState(false);
  const LC={bash:"#00FFB2",yaml:"#A855F7",python:"#FF6B35",json:"#FACC15"};
  return(
    <div style={{background:"#060A0E",border:"1px solid #1A2030",borderRadius:4,overflow:"hidden",marginTop:8}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 14px",background:"#0D1117",borderBottom:"1px solid #1A2030"}}>
        <span style={{fontSize:8,color:LC[lang]||"#4A5568",letterSpacing:2,textTransform:"uppercase"}}>{lang}</span>
        <button onClick={()=>{navigator.clipboard.writeText(content).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1500);});}} style={{background:"none",border:"none",cursor:"pointer",color:copied?"#00FFB2":"#4A5568",fontSize:9,letterSpacing:1,padding:"2px 6px"}}>
          {copied?"✓ COPIED":"COPY"}
        </button>
      </div>
      <pre style={{margin:0,padding:"14px",overflowX:"auto",fontSize:10,lineHeight:1.7,color:"#C9D1D9",fontFamily:"'DM Mono','Fira Mono',monospace",whiteSpace:"pre"}}>{content}</pre>
    </div>
  );
}

function ContentRenderer({sections}){
  if(!sections||!sections.length) return null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {sections.map((s,i)=>(
        <div key={i}>
          <div style={{fontSize:9,color:"#FACC15",letterSpacing:3,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
            <span>{s.type==="concept"?"◆":s.type==="tips"?"💡":"⬡"}</span>
            <span>{s.title.toUpperCase()}</span>
          </div>
          {s.type==="concept"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:6}}>
              {s.items.map((item,j)=>(
                <div key={j} style={{background:"#060A0E",border:"1px solid #1A2030",padding:"10px 13px",borderRadius:4,borderLeft:"2px solid #FACC15"}}>
                  <div style={{fontSize:11,color:"#FACC15",fontWeight:500,marginBottom:4}}>{item.term}</div>
                  <div style={{fontSize:10,color:"#7A8394",lineHeight:1.55}}>{item.def}</div>
                </div>
              ))}
            </div>
          )}
          {s.type==="code"&&<CodeBlock content={s.content} lang={s.lang}/>}
          {s.type==="tips"&&(
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {s.items.map((tip,j)=>(
                <div key={j} style={{background:"#0D1A12",border:"1px solid #00FFB220",padding:"9px 14px",borderRadius:4,fontSize:11,color:"#A0B8A0",lineHeight:1.55,display:"flex",gap:8}}>
                  <span style={{color:"#00FFB2",flexShrink:0}}>→</span><span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
async function loadData(key){
  try{const r=await window.storage.get(key);return r?JSON.parse(r.value):null;}catch{
    try{const d=localStorage.getItem(key);return d?JSON.parse(d):null;}catch{return null;}
  }
}
async function saveData(key,d){
  try{await window.storage.set(key,JSON.stringify(d));}catch{
    try{localStorage.setItem(key,JSON.stringify(d));}catch{}
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAN 1 — AI INFRASTRUCTURE (12 WEEKS)
// ═══════════════════════════════════════════════════════════════════════════════

const AI_PILLARS=[
  {id:"P1",label:"AI-Native Platform Engineering",color:"#00FFB2",icon:"◈",why:"Platform engineers who deploy + operate AI workloads are the rarest & highest-paid role next decade."},
  {id:"P2",label:"MLOps & Model Lifecycle",color:"#FF6B35",icon:"⬡",why:"Every company will have models in prod. Someone needs to own pipeline, drift detection & retraining."},
  {id:"P3",label:"AI Agents for Infrastructure",color:"#A855F7",icon:"◉",why:"Autonomous agents will replace L1/L2 ops. You must learn to build, orchestrate and guardrail them."},
  {id:"P4",label:"GPU & AI Infra at Scale",color:"#FACC15",icon:"◆",why:"CUDA clusters, inference servers, distributed training — ops for AI hardware is a decade-long moat."},
];

const AI_WEEKS=[
  {week:1,phase:"FOUNDATION",phaseColor:"#00FFB2",pillar:"P1",hours:28,title:"LLM Infra Basics — Local to Served",
   skills:["Deploy LLMs locally: Ollama, LM Studio","Understand tokenization + inference pipeline (ops lens)","Run Llama3/Mistral via REST API","OpenAI-compatible endpoint basics","First Prometheus metrics for inference"],
   projects:[{name:"Local LLM Stack",desc:"Ollama + Open WebUI on Docker Compose. Expose API, test with curl, monitor with Prometheus.",hard:false}],
   tools:["Ollama","Docker Compose","Prometheus","curl"],
   resources:[
     {type:"docs",label:"vLLM Official Docs",url:"https://docs.vllm.ai",note:"Engine args, API, metrics."},
     {type:"docs",label:"Ollama GitHub",url:"https://github.com/ollama/ollama",note:"Modelfile format, GPU config."},
     {type:"course",label:"LLMOps — DeepLearning.AI (FREE)",url:"https://www.deeplearning.ai/short-courses/llmops/",note:"2hr deployment pipelines."},
     {type:"video",label:"Andrej Karpathy — Intro to LLMs",url:"https://www.youtube.com/watch?v=zjkBMFhNj_g",note:"Mental model for what you're operating."},
     {type:"book",label:"LLM Engineer's Handbook — Packt 2024",url:"https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072",note:"Chapters 1–3."},
     {type:"repo",label:"LLMPerf Benchmark Tool",url:"https://github.com/ray-project/llmperf",note:"Week 2 project tool."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Token",def:"Atomic unit of LLM I/O. ~4 chars ≈ 1 token. Every API call is billed in tokens."},
       {term:"Context Window",def:"Max tokens the model sees at once. Llama3-8B=8k, Mistral=32k, some models 128k+."},
       {term:"TTFT",def:"Time To First Token — latency until streaming begins. The UX metric. Target <500ms."},
       {term:"KV Cache",def:"Cached attention computations. vLLM's PagedAttention manages this like virtual memory."},
       {term:"Quantization",def:"Compressing weights FP16→INT4/INT8. 2–4x less VRAM, slight quality drop. Q4_K_M is sweet spot."},
     ]},
     {title:"Install & Run Ollama",type:"code",lang:"bash",content:`# Install
curl -fsSL https://ollama.com/install.sh | sh
ollama serve

# Pull and run models
ollama pull llama3          # 8B params, 4.7GB
ollama pull mistral         # 7B, great tool use
ollama pull phi3:mini       # 3.8B, fast, good for testing
ollama run llama3

# REST API (OpenAI-compatible)
curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama3",
    "messages": [{"role":"user","content":"Explain pods in 1 sentence"}]
  }'

# Custom model with system prompt
cat > Modelfile << 'EOF'
FROM llama3
SYSTEM "You are a senior SRE. Give concise, production-focused answers."
PARAMETER temperature 0.3
EOF
ollama create devops-assistant -f Modelfile`},
     {title:"Docker Compose: Ollama + Open WebUI",type:"code",lang:"yaml",content:`version: "3.8"
services:
  ollama:
    image: ollama/ollama:latest
    ports: ["11434:11434"]
    volumes: [ollama_data:/root/.ollama]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports: ["3000:8080"]
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    volumes: [webui_data:/app/backend/data]
    depends_on: [ollama]

  prometheus:
    image: prom/prometheus:latest
    ports: ["9090:9090"]
    volumes: [./prometheus.yml:/etc/prometheus/prometheus.yml]

volumes:
  ollama_data:
  webui_data:`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "Ollama is dev/test. vLLM is production. Don't confuse them.",
       "First request is slow (model load). Subsequent requests are fast. Always warm up in prod.",
       "GPU VRAM is the bottleneck. 7B in Q4 needs ~4GB VRAM. 13B needs ~8GB. 70B needs ~40GB.",
       "stream:true cuts perceived latency dramatically. Always stream for user-facing apps.",
       "OpenAI-compatible endpoint means any OpenAI tool works with just a URL change.",
     ]},
   ]},
  {week:2,phase:"FOUNDATION",phaseColor:"#00FFB2",pillar:"P1",hours:30,title:"Production LLM Serving — vLLM + API Gateway",
   skills:["Deploy vLLM on Kubernetes","Triton Inference Server backends","API gateway (Kong) in front of LLMs","Rate limiting, token tracking, auth","Grafana dashboards: latency, TTFT, tokens/sec"],
   projects:[
     {name:"LLM API Gateway",desc:"vLLM behind Kong on k8s. Rate limiting, token tracking, Grafana dashboard for p95/p99 latency.",hard:true},
     {name:"Inference Benchmarker",desc:"Load-test with LLMPerf. Measure p95/p99, TTFT, tokens/sec. Auto-generate HTML report.",hard:false},
   ],
   tools:["vLLM","Kong","Grafana","k8s","LLMPerf"],
   resources:[
     {type:"docs",label:"NVIDIA Triton Docs",url:"https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/",note:"Backends, dynamic batching."},
     {type:"docs",label:"Kong Gateway Docs",url:"https://docs.konghq.com/gateway/latest/",note:"Rate limiting + prometheus plugin."},
     {type:"course",label:"Full Stack LLM Bootcamp (FREE)",url:"https://fullstackdeeplearning.com/llm-bootcamp/",note:"Watch Week 1–2."},
     {type:"video",label:"vLLM Paper — Yannic Kilcher",url:"https://www.youtube.com/watch?v=80bIUggRJf4",note:"PagedAttention explained."},
     {type:"repo",label:"vLLM GitHub",url:"https://github.com/vllm-project/vllm",note:"Read examples/ folder."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"vLLM",def:"Production inference server. Uses PagedAttention for efficient KV cache. 2–24x faster than naive serving."},
       {term:"PagedAttention",def:"Manages KV cache like OS virtual memory. No fragmentation waste. The core reason vLLM is fast."},
       {term:"Continuous Batching",def:"Processes new requests as old ones finish tokens. Doubles throughput vs static batching."},
       {term:"API Gateway",def:"Kong/NGINX in front of your LLM. Auth, rate limiting, logging. Never expose LLM directly."},
     ]},
     {title:"vLLM: Deploy on Kubernetes",type:"code",lang:"yaml",content:`# vllm-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-server
  namespace: llm-serving
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vllm-server
  template:
    metadata:
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8000"
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        args:
          - --model=meta-llama/Llama-3-8B-Instruct
          - --gpu-memory-utilization=0.90
          - --port=8000
          - --max-model-len=4096
        ports:
        - containerPort: 8000
        resources:
          limits:
            nvidia.com/gpu: "1"
            memory: "16Gi"
        env:
        - name: HUGGING_FACE_HUB_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-token
              key: token
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-server
  namespace: llm-serving
spec:
  selector:
    app: vllm-server
  ports:
  - port: 8000
    targetPort: 8000`},
     {title:"Kong Rate Limiting",type:"code",lang:"yaml",content:`apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: llm-rate-limit
plugin: rate-limiting
config:
  minute: 60
  hour: 1000
  policy: redis
  redis_host: redis
  limit_by: consumer
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vllm-ingress
  annotations:
    konghq.com/plugins: llm-rate-limit
spec:
  ingressClassName: kong
  rules:
  - host: llm.yourdomain.com
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: vllm-server
            port:
              number: 8000`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "vLLM downloads from HuggingFace on first start. Pre-pull to a PVC to avoid cold starts.",
       "gpu-memory-utilization=0.90 is the safe default. Don't go higher without testing.",
       "Always run benchmarks BEFORE going to prod. Throughput drops sharply at high concurrency.",
       "Kong rate limiting 'by consumer' requires API keys — set up key-auth plugin first.",
     ]},
   ]},
  {week:3,phase:"FOUNDATION",phaseColor:"#00FFB2",pillar:"P2",hours:28,title:"MLOps Foundations — Data, Experiments, Registry",
   skills:["Data versioning with DVC + S3/MinIO","Self-hosted MLflow: tracking + UI","Model registry: versions, stages, aliases","MinIO as artifact store on k8s","ML metadata lineage"],
   projects:[{name:"Self-Hosted MLOps Stack",desc:"MLflow + MinIO on k8s via Helm. Track a training run, version model, promote dev→staging with quality gate.",hard:false}],
   tools:["MLflow","DVC","MinIO","Helm","k8s"],
   resources:[
     {type:"docs",label:"MLflow Model Registry",url:"https://mlflow.org/docs/latest/model-registry.html",note:"Registry API, stages, aliases."},
     {type:"docs",label:"DVC Official Docs",url:"https://dvc.org/doc",note:"Data versioning + pipelines."},
     {type:"course",label:"Made With ML (FREE)",url:"https://madewithml.com",note:"Best free MLOps resource."},
     {type:"course",label:"MLOps Zoomcamp (FREE)",url:"https://github.com/DataTalksClub/mlops-zoomcamp",note:"Hands-on. All code on GitHub."},
     {type:"book",label:"Designing ML Systems — Chip Huyen",url:"https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",note:"Read Chapters 6 + 9 first."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Experiment Tracking",def:"Logging params, metrics, artifacts per training run. Makes runs reproducible. MLflow is the standard."},
       {term:"Model Registry",def:"Versioned store of trained models with stage metadata (dev/staging/prod). The deployment API for models."},
       {term:"DVC",def:"Data Version Control. Tracks datasets like git tracks code. .dvc pointer files in git, actual data in S3/MinIO."},
       {term:"MinIO",def:"S3-compatible object storage you self-host on k8s. Drop-in replacement for AWS S3 in dev/staging."},
     ]},
     {title:"Deploy MLflow + MinIO on Kubernetes",type:"code",lang:"bash",content:`# Add Helm repos
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Deploy MinIO
helm install minio bitnami/minio \\
  --namespace mlops --create-namespace \\
  --set auth.rootUser=minioadmin \\
  --set auth.rootPassword=minioadmin123 \\
  --set persistence.size=50Gi

# Create mlflow bucket
kubectl run mc --image=minio/mc --rm -it --restart=Never -- \\
  sh -c "mc alias set minio http://minio:9000 minioadmin minioadmin123 && mc mb minio/mlflow"

# Port-forward to test
kubectl port-forward svc/mlflow 5000:5000 -n mlops
# Open http://localhost:5000`},
     {title:"MLflow Tracking in Python",type:"code",lang:"python",content:`import mlflow
import mlflow.sklearn

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("my-model-v1")

with mlflow.start_run():
    params = {"n_estimators": 100, "max_depth": 5}
    mlflow.log_params(params)

    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    acc = accuracy_score(y_test, model.predict(X_test))
    mlflow.log_metric("accuracy", acc)

    mlflow.sklearn.log_model(
        model, "model",
        registered_model_name="my-classifier"
    )

# Promote to staging
from mlflow.tracking import MlflowClient
client = MlflowClient()
versions = client.get_latest_versions("my-classifier", stages=["None"])
client.transition_model_version_stage(
    name="my-classifier",
    version=versions[0].version,
    stage="Staging"
)`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "MLflow backend store (PostgreSQL) = metadata. Artifact store (MinIO) = files. Both required in prod.",
       "Always log params AND metrics in the same run. Without params you can't reproduce the result.",
       "DVC .dvc files go in git. Actual data stays in remote storage. Commit the pointer, not the data.",
     ]},
   ]},
  {week:4,phase:"FOUNDATION",phaseColor:"#00FFB2",pillar:"P2",hours:30,title:"MLOps Pipeline — CI/CD, Features, Auto-Deploy",
   skills:["Feature store: Feast on k8s","CI/CD for ML: retrain → validate → deploy","GitHub Actions ML pipeline","Model performance gates","Feast online/offline store split"],
   projects:[
     {name:"End-to-End MLOps Pipeline",desc:"GitHub Actions → DVC pull data → train → MLflow log → promote if metrics pass → auto-deploy to vLLM.",hard:true},
     {name:"Model Registry Gate",desc:"MLflow promotion gates dev→staging→prod. Slack notification on failures.",hard:false},
   ],
   tools:["MLflow","Feast","GitHub Actions","DVC","Slack"],
   resources:[
     {type:"docs",label:"Feast Docs",url:"https://docs.feast.dev",note:"Architecture + k8s deployment."},
     {type:"course",label:"MLOps Specialization — Andrew Ng (FREE audit)",url:"https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops",note:"Courses 2–4 most relevant."},
     {type:"book",label:"Introducing MLOps — O'Reilly",url:"https://www.oreilly.com/library/view/introducing-mlops/9781492083283/",note:"Fast mental model."},
     {type:"repo",label:"ZenML Production MLOps",url:"https://github.com/zenml-io/zenml",note:"Study how a real framework works."},
   ],
   content:[
     {title:"GitHub Actions ML Pipeline",type:"code",lang:"yaml",content:`# .github/workflows/ml-pipeline.yaml
name: ML Training Pipeline

on:
  push:
    paths: ['data/**', 'src/**']
  workflow_dispatch:

jobs:
  train-and-evaluate:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4

      - name: Pull data from DVC
        run: dvc pull

      - name: Run pipeline
        run: dvc repro

      - name: Quality gate
        run: |
          python << 'PYEOF'
          import json, sys
          with open('metrics.json') as f:
              m = json.load(f)
          if m['accuracy'] < 0.85:
              print(f"FAIL: accuracy {m['accuracy']} < 0.85")
              sys.exit(1)
          print(f"PASS: accuracy={m['accuracy']}")
          PYEOF

      - name: Promote model to staging
        run: python promote_model.py --stage Staging

      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1.25.0
        with:
          payload: '{"text":"ML Pipeline \${{ job.status }}"}'
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "dvc repro only reruns stages whose dependencies changed. Trust it — it's like Make for ML.",
       "GitHub Actions self-hosted runners on k8s: use actions-runner-controller (ARC) for GPU access.",
       "Quality gates should fail loudly. A silent pass with degraded metrics is worse than a visible failure.",
     ]},
   ]},
  {week:5,phase:"CORE AI",phaseColor:"#FF6B35",pillar:"P3",hours:32,title:"Build AI Agents — From Zero",
   skills:["Agent architecture: ReAct, Plan-and-Execute","LangGraph for stateful multi-step agents","Tool calling: bash, k8s API, AWS SDK","Memory: short-term (context) + long-term (vector DB)","Agent observability: traces, token costs"],
   projects:[{name:"Runbook Agent",desc:"Feed agent your runbooks. Responds to PagerDuty alerts, walks through steps, reports outcomes to Slack.",hard:false}],
   tools:["LangGraph","LangChain","Qdrant","LangFuse","Slack API"],
   resources:[
     {type:"docs",label:"LangGraph Official Docs",url:"https://langchain-ai.github.io/langgraph/",note:"Do ALL tutorials before coding."},
     {type:"docs",label:"Anthropic Tool Use Docs",url:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use",note:"Foundation of every agent."},
     {type:"course",label:"AI Agents in LangGraph (FREE)",url:"https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",note:"Do this Day 1 of Week 5."},
     {type:"course",label:"Building Agentic RAG (FREE)",url:"https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/",note:"Runbook agent needs RAG."},
     {type:"repo",label:"LangGraph GitHub Examples",url:"https://github.com/langchain-ai/langgraph/tree/main/examples",note:"Run every example first."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Agent",def:"An LLM + tools + a loop. Model decides which tool to call, calls it, observes output, decides next step."},
       {term:"ReAct",def:"Reason + Act. Model outputs a thought, then an action, observes result, repeats. Most common pattern."},
       {term:"LangGraph",def:"Stateful agent framework built on a directed graph. Each node is a function. Edges define transitions."},
       {term:"Checkpointing",def:"LangGraph persists state to DB between steps. Enables pause, resume, human-in-the-loop approval."},
     ]},
     {title:"LangGraph: Runbook Agent",type:"code",lang:"python",content:`# pip install langgraph langchain-anthropic qdrant-client

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, ToolMessage
from typing import TypedDict, List, Annotated
import operator, subprocess

@tool
def search_runbook(query: str) -> str:
    """Search runbook knowledge base for relevant procedures."""
    # Query your Qdrant vector store
    docs = vectorstore.similarity_search(query, k=3)
    return "\\n\\n".join([d.page_content for d in docs])

@tool
def run_command(command: str) -> str:
    """Run a read-only kubectl command to gather information."""
    ALLOWED = ["kubectl get", "kubectl describe", "kubectl logs"]
    if not any(command.startswith(p) for p in ALLOWED):
        return "ERROR: Only read-only kubectl commands allowed."
    result = subprocess.run(command.split(), capture_output=True, text=True, timeout=30)
    return result.stdout[:2000] or result.stderr[:500]

@tool
def notify_slack(message: str) -> str:
    """Send findings and recommendations to Slack ops channel."""
    import requests, os
    r = requests.post(os.environ["SLACK_WEBHOOK"], json={"text": message})
    return "Sent" if r.ok else f"Failed: {r.text}"

# Build and run
llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
tools = [search_runbook, run_command, notify_slack]
llm_with_tools = llm.bind_tools(tools)

class State(TypedDict):
    messages: Annotated[List, operator.add]

def agent(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

def call_tools(state: State):
    tool_map = {t.name: t for t in tools}
    last = state["messages"][-1]
    results = []
    for tc in last.tool_calls:
        result = tool_map[tc["name"]].invoke(tc["args"])
        results.append(ToolMessage(content=str(result), tool_call_id=tc["id"]))
    return {"messages": results}

def should_continue(state: State):
    last = state["messages"][-1]
    return "tools" if getattr(last, "tool_calls", None) else END

memory = SqliteSaver.from_conn_string(":memory:")
g = StateGraph(State)
g.add_node("agent", agent)
g.add_node("tools", call_tools)
g.set_entry_point("agent")
g.add_conditional_edges("agent", should_continue)
g.add_edge("tools", "agent")
runbook_agent = g.compile(checkpointer=memory)

result = runbook_agent.invoke(
    {"messages": [HumanMessage("High memory on payment-service pods in prod")]},
    config={"configurable": {"thread_id": "incident-001"}}
)`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "An agent is just a while loop: call LLM → if tool_call → execute tool → append result → repeat.",
       "Tool descriptions are prompt engineering. The LLM picks tools based on the description string alone.",
       "Read-only tools first. Write tools (kubectl apply) only with human approval gates.",
       "SqliteSaver makes agents resumable after crashes. Always use it in production.",
     ]},
   ]},
  {week:6,phase:"CORE AI",phaseColor:"#FF6B35",pillar:"P3",hours:32,title:"AI Agents Managing Infrastructure",
   skills:["MCP (Model Context Protocol) servers","Agent + Terraform: plan, review, apply cycle","Human-in-the-loop approval workflows","Security guardrails for autonomous agents","Multi-agent patterns"],
   projects:[
     {name:"K8s Ops Agent",desc:"Detects OOMKilled pods, analyzes logs, proposes fix, applies after Slack approval. Full feedback loop.",hard:true},
     {name:"Autonomous FinOps Agent",desc:"Scans AWS Cost Explorer, identifies waste, generates Terraform PRs, routes for human approval.",hard:true},
   ],
   tools:["MCP","Terraform","AWS SDK","Anthropic API","GitHub"],
   resources:[
     {type:"docs",label:"MCP Specification",url:"https://modelcontextprotocol.io/docs",note:"Read full spec, then build a server."},
     {type:"docs",label:"MCP Servers Directory",url:"https://github.com/modelcontextprotocol/servers",note:"Study existing implementations."},
     {type:"course",label:"Building MCP Servers (FREE)",url:"https://modelcontextprotocol.io/tutorials/building-mcp-with-llms",note:"Official tutorial. 2 hours."},
     {type:"video",label:"MCP Explained + Demo",url:"https://www.youtube.com/watch?v=7j_NE6Pjv-E",note:"Watch before reading the spec."},
     {type:"repo",label:"Anthropic Quickstarts",url:"https://github.com/anthropics/anthropic-quickstarts",note:"Production agent templates."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"MCP",def:"Model Context Protocol. Anthropic's standard for connecting LLMs to tools. Like LSP but for AI."},
       {term:"MCP Server",def:"Process exposing tools via MCP protocol. LLM client calls it for Terraform, GitHub, AWS tools."},
       {term:"Human-in-the-Loop",def:"Pausing agent execution for human approval before applying changes. Non-negotiable for infra writes."},
       {term:"Plan/Apply",def:"Terraform pattern agents must follow: plan (show changes) → human reviews → apply (make changes)."},
     ]},
     {title:"MCP Server for Kubernetes",type:"code",lang:"python",content:`# pip install mcp kubernetes

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types
from kubernetes import client, config
import json

app = Server("k8s-mcp-server")
config.load_kube_config()
v1 = client.CoreV1Api()

@app.list_tools()
async def list_tools():
    return [
        types.Tool(
            name="get_pods",
            description="List pods in a namespace with their status",
            inputSchema={
                "type": "object",
                "properties": {
                    "namespace": {"type": "string"}
                },
                "required": ["namespace"]
            }
        ),
        types.Tool(
            name="get_pod_logs",
            description="Get logs from a pod (last 100 lines)",
            inputSchema={
                "type": "object",
                "properties": {
                    "namespace": {"type": "string"},
                    "pod_name": {"type": "string"}
                },
                "required": ["namespace","pod_name"]
            }
        ),
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_pods":
        pods = v1.list_namespaced_pod(arguments["namespace"])
        result = [{"name": p.metadata.name, "status": p.status.phase,
                   "restarts": p.status.container_statuses[0].restart_count
                   if p.status.container_statuses else 0}
                  for p in pods.items]
        return [types.TextContent(type="text", text=json.dumps(result, indent=2))]

    elif name == "get_pod_logs":
        logs = v1.read_namespaced_pod_log(
            name=arguments["pod_name"],
            namespace=arguments["namespace"],
            tail_lines=100)
        return [types.TextContent(type="text", text=logs)]

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write, app.create_initialization_options())

import asyncio
asyncio.run(main())`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "interrupt_before=['execute'] in LangGraph is the human-in-the-loop mechanism. Graph pauses, waits for .update_state(), then resumes.",
       "Never give an infra agent unconditional write access. Read tools are free. Write tools need approval gates.",
       "Log every agent action to an audit trail: who triggered it, what it did, what the outcome was.",
     ]},
   ]},
  {week:7,phase:"COMPLEX ARCH",phaseColor:"#A855F7",pillar:"P1",hours:32,title:"Complex Architecture — Service Mesh + Multi-Cluster",
   skills:["Istio: mTLS, traffic shaping, circuit breaking","Multi-cluster k8s: Cluster API + ArgoCD","App of Apps GitOps pattern","Cross-cluster traffic + service discovery","Linkerd as lighter alternative"],
   projects:[{name:"Multi-Cluster AI Platform",desc:"3-cluster setup. ArgoCD App-of-Apps manages all. Istio cross-cluster mTLS. One cluster for GPU inference.",hard:true}],
   tools:["Istio","ArgoCD","Cluster API","Helm"],
   resources:[
     {type:"docs",label:"Istio Official Docs",url:"https://istio.io/latest/docs/",note:"Do all Tasks hands-on."},
     {type:"docs",label:"ArgoCD Multi-Cluster",url:"https://argo-cd.readthedocs.io/en/stable/user-guide/cluster-bootstrapping/",note:"App of Apps pattern."},
     {type:"course",label:"Istio Service Mesh (Udemy)",url:"https://www.udemy.com/course/istio-hands-on-for-kubernetes/",note:"Deep traffic policies."},
     {type:"video",label:"TechWorld with Nana — ArgoCD (3hr)",url:"https://www.youtube.com/watch?v=MeU5_k9ssrs",note:"Best free ArgoCD deep dive."},
     {type:"book",label:"Designing Distributed Systems — Burns (FREE)",url:"https://azure.microsoft.com/en-us/resources/designing-distributed-systems/",note:"Free PDF. Chapters 1–6."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Envoy Sidecar",def:"Injected into every pod. Intercepts ALL traffic. Handles TLS, retries, circuit breaking without app changes."},
       {term:"mTLS",def:"Mutual TLS — both sides authenticate. Istio enables this automatically. Zero-trust networking."},
       {term:"App of Apps",def:"ArgoCD pattern: one root Application whose manifests contain other Application CRDs. One sync deploys everything."},
       {term:"VirtualService",def:"Istio routing rules. Traffic splitting by weight (canary), by header (A/B), with timeouts and retries."},
     ]},
     {title:"Istio: Install + STRICT mTLS",type:"code",lang:"bash",content:`# Install Istio
curl -L https://istio.io/downloadIstio | sh -
istioctl install --set profile=production -y

# Enable injection per namespace
kubectl label namespace llm-serving istio-injection=enabled
kubectl rollout restart deployment --all -n llm-serving

# Enforce STRICT mTLS cluster-wide
kubectl apply -f - << 'EOF'
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
EOF

# Canary: 90/10 traffic split
kubectl apply -f - << 'EOF'
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts: [my-service]
  http:
  - route:
    - destination: {host: my-service, subset: v1}
      weight: 90
    - destination: {host: my-service, subset: v2}
      weight: 10
    retries:
      attempts: 3
      perTryTimeout: 2s
EOF`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "STRICT mTLS breaks services calling external HTTP endpoints. Use ServiceEntry to declare external services.",
       "App of Apps: root Application syncs Application CRDs into ArgoCD. ArgoCD then syncs those. Turtles all the way down.",
       "Commit EVERYTHING to git. ArgoCD self-heal reverts any manual kubectl apply. This is the point — embrace it.",
     ]},
   ]},
  {week:8,phase:"COMPLEX ARCH",phaseColor:"#A855F7",pillar:"P1",hours:32,title:"Kafka, Events & Chaos Engineering",
   skills:["Kafka: partitions, consumer groups, Schema Registry","Kafka Connect for ML feature ingestion","CQRS + Event Sourcing patterns","Chaos Mesh: fault injection","Chaos in CI: resilience as code"],
   projects:[
     {name:"Kafka ML Feature Pipeline",desc:"Real-time features: Kafka Streams → Feast online store → live inference endpoint within 100ms.",hard:true},
     {name:"Chaos Test Suite",desc:"Chaos Mesh scenarios: pod kill, network partition, I/O delay. Run in CI. Assert SLO recovery.",hard:false},
   ],
   tools:["Kafka","Chaos Mesh","Schema Registry","Feast"],
   resources:[
     {type:"docs",label:"Confluent Kafka Docs",url:"https://docs.confluent.io/platform/current/",note:"Schema Registry + Kafka Connect."},
     {type:"course",label:"Apache Kafka Series — Maarek (Udemy)",url:"https://www.udemy.com/course/apache-kafka/",note:"Best Kafka course."},
     {type:"book",label:"Kafka Definitive Guide (FREE)",url:"https://www.confluent.io/resources/kafka-the-definitive-guide-v2/",note:"Chapters 1,3,7,9."},
     {type:"video",label:"Hussein Nasser — Kafka Internals",url:"https://www.youtube.com/watch?v=R873BlNVUqQ",note:"Partitions and replication."},
     {type:"repo",label:"Chaos Mesh GitHub",url:"https://github.com/chaos-mesh/chaos-mesh",note:"Automate chaos in CI."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Topic",def:"Named append-only stream of records. Like a table but replicated and immutable."},
       {term:"Consumer Group",def:"Set of consumers sharing topic consumption. Each partition consumed by exactly one consumer in the group."},
       {term:"Schema Registry",def:"Centralized schema store. Prevents producer schema changes from silently breaking consumers."},
       {term:"Chaos Engineering",def:"Intentionally injecting failures to test resilience before prod does it for you."},
     ]},
     {title:"Deploy Kafka (Strimzi) + Chaos Mesh",type:"code",lang:"bash",content:`# Deploy Kafka via Strimzi
kubectl create namespace kafka
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka -n kafka

kubectl apply -f - << 'EOF'
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: ml-kafka
  namespace: kafka
spec:
  kafka:
    version: 3.7.0
    replicas: 3
    listeners:
      - name: plain
        port: 9092
        type: internal
        tls: false
    config:
      default.replication.factor: 3
      min.insync.replicas: 2
    storage:
      type: persistent-claim
      size: 50Gi
  zookeeper:
    replicas: 3
    storage:
      type: persistent-claim
      size: 10Gi
EOF

# Install Chaos Mesh
helm repo add chaos-mesh https://charts.chaos-mesh.org
helm install chaos-mesh chaos-mesh/chaos-mesh \\
  --namespace chaos-testing --create-namespace

# Chaos scenario: kill Kafka pods
kubectl apply -f - << 'EOF'
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: kafka-pod-kill
  namespace: chaos-testing
spec:
  action: pod-kill
  mode: one
  selector:
    namespaces: [kafka]
    labelSelectors:
      "strimzi.io/name": "ml-kafka-kafka"
  scheduler:
    cron: "@every 5m"
EOF`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "Partition count is permanent — set it right: partitions = max consumers you'll ever want.",
       "min.insync.replicas=2 with acks=all = writes only succeed when 2 replicas confirm. Your durability guarantee.",
       "Schema Registry is not optional in prod. Without it a producer change silently breaks all consumers.",
       "Run chaos experiments in staging first. Start with stateless services before stateful ones.",
     ]},
   ]},
  {week:9,phase:"COMPLEX ARCH",phaseColor:"#A855F7",pillar:"P4",hours:30,title:"GPU Infra — NVIDIA Operator, MIG, Time-Slicing",
   skills:["NVIDIA GPU Operator on k8s","MIG (Multi-Instance GPU) config","GPU time-slicing for shared workloads","Device plugin + resource requests","GPU monitoring: DCGM + Grafana"],
   projects:[{name:"GPU k8s Cluster",desc:"GPU Operator on k8s. Configure MIG/time-slicing. DCGM metrics in Grafana. GPU quotas per namespace.",hard:true}],
   tools:["NVIDIA GPU Operator","DCGM","MIG","Grafana"],
   resources:[
     {type:"docs",label:"NVIDIA GPU Operator Docs",url:"https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html",note:"MIG config, time-slicing."},
     {type:"course",label:"NVIDIA DLI — GPU on k8s (FREE with NGC)",url:"https://courses.nvidia.com/courses/course-v1:DLI+C-ML-01+V1/",note:"Hands-on from NVIDIA."},
     {type:"video",label:"GPU Infrastructure at Scale — KubeCon",url:"https://www.youtube.com/watch?v=Qe5-O_FYKtw",note:"Real production GPU setup."},
     {type:"repo",label:"NVIDIA GPU Operator GitHub",url:"https://github.com/NVIDIA/gpu-operator",note:"Study Helm chart values."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"GPU Operator",def:"k8s operator automating GPU driver, container toolkit, device plugin, DCGM install. One Helm install."},
       {term:"MIG",def:"Multi-Instance GPU. Partition A100/H100 into up to 7 isolated instances. Hard isolation — dedicated VRAM."},
       {term:"Time-Slicing",def:"Share one GPU across multiple containers via time multiplexing. Soft isolation — no memory guarantees."},
       {term:"DCGM",def:"NVIDIA Data Center GPU Manager. Exposes GPU metrics (utilization, memory, temp) to Prometheus."},
     ]},
     {title:"GPU Operator Setup",type:"code",lang:"bash",content:`# Install GPU Operator
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm install gpu-operator nvidia/gpu-operator \\
  --namespace gpu-operator --create-namespace \\
  --set driver.enabled=true \\
  --set toolkit.enabled=true \\
  --set devicePlugin.enabled=true \\
  --set dcgmExporter.enabled=true \\
  --set mig.strategy=mixed

# Verify
kubectl get pods -n gpu-operator
kubectl describe node <gpu-node> | grep nvidia.com/gpu

# Test GPU access
kubectl run gpu-test --image=nvcr.io/nvidia/cuda:12.3.0-base-ubuntu22.04 \\
  --restart=Never \\
  --limits='nvidia.com/gpu=1' \\
  -- nvidia-smi

# Time-slicing config (4 containers share 1 GPU)
kubectl apply -f - << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: time-slicing-config
  namespace: gpu-operator
data:
  any: |
    version: v1
    sharing:
      timeSlicing:
        resources:
        - name: nvidia.com/gpu
          replicas: 4
EOF`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "MIG = hard isolation. Time-slicing = soft sharing. Use MIG for SLA-bound workloads.",
       "Never install NVIDIA drivers manually on a k8s GPU node. The GPU Operator manages them.",
       "VRAM is your primary constraint. Fill VRAM first, then worry about GPU utilization.",
       "Drain nodes before changing MIG configuration — requires a node restart.",
     ]},
   ]},
  {week:10,phase:"COMPLEX ARCH",phaseColor:"#A855F7",pillar:"P4",hours:32,title:"Ray, Distributed Training & GPU Autoscaling",
   skills:["Distributed training: Ray Train, PyTorch DDP on k8s","KEDA autoscaling with GPU queue depth","Karpenter for GPU node provisioning","Spot GPU strategy for training","Model parallelism concepts"],
   projects:[
     {name:"GPU Cluster Autoscaler",desc:"KEDA watches vLLM queue → scales pods → Karpenter provisions GPU nodes. Full cycle under load test.",hard:true},
     {name:"Distributed Training Orchestrator",desc:"Ray on k8s: submit training job, auto-recover on spot interruption, checkpoint to S3.",hard:false},
   ],
   tools:["Ray","KEDA","Karpenter","PyTorch","KubeRay"],
   resources:[
     {type:"docs",label:"KubeRay Docs",url:"https://docs.ray.io/en/latest/cluster/kubernetes/index.html",note:"RayCluster CRD, autoscaling."},
     {type:"docs",label:"KEDA Prometheus Scaler",url:"https://keda.sh/docs/2.14/scalers/prometheus/",note:"GPU queue depth → scale vLLM."},
     {type:"docs",label:"Karpenter Docs",url:"https://karpenter.sh/docs/",note:"NodePools, spot interruption."},
     {type:"video",label:"Karpenter Deep Dive — AWS re:Invent",url:"https://www.youtube.com/watch?v=43g8uPohTgc",note:"Spot + GPU provisioning patterns."},
     {type:"repo",label:"Ray Project GitHub",url:"https://github.com/ray-project/ray",note:"Read python/ray/train/examples/."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Data Parallelism",def:"Copy model to each GPU, split data, average gradients. Most common strategy. PyTorch DDP."},
       {term:"RayCluster",def:"k8s CRD for a Ray cluster. Head node + worker nodes. Autoscaling based on pending tasks."},
       {term:"KEDA",def:"Kubernetes Event-Driven Autoscaling. Scales workloads based on Prometheus metrics, queue depth, etc."},
       {term:"Karpenter",def:"Node autoscaler. Provisions nodes based on pending pod requirements. Handles spot in ~30s."},
     ]},
     {title:"KEDA + Karpenter GPU Autoscaling",type:"code",lang:"yaml",content:`# KEDA: scale vLLM pods on queue depth
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: vllm-autoscaler
  namespace: llm-serving
spec:
  scaleTargetRef:
    name: vllm-server
  minReplicaCount: 1
  maxReplicaCount: 10
  cooldownPeriod: 120
  triggers:
  - type: prometheus
    metadata:
      serverAddress: http://prometheus:9090
      metricName: vllm_queue_depth
      threshold: "5"
      query: avg(vllm:num_requests_waiting)
---
# Karpenter: GPU NodePool
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: gpu-nodepool
spec:
  template:
    spec:
      nodeClassRef:
        name: gpu-ec2-nodeclass
      requirements:
        - key: karpenter.k8s.aws/instance-family
          operator: In
          values: [g5, g4dn]
        - key: karpenter.sh/capacity-type
          operator: In
          values: [spot, on-demand]
      taints:
        - key: nvidia.com/gpu
          effect: NoSchedule
  limits:
    nvidia.com/gpu: "20"
  disruption:
    consolidationPolicy: WhenEmpty
    consolidateAfter: 30s`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "DDP syncs gradients after every backward pass. More workers = faster training but more communication overhead.",
       "Set S3 storage_path in Ray Train for automatic checkpoint recovery on spot interruption. Free fault tolerance.",
       "Karpenter provisions nodes in ~30s vs Cluster Autoscaler ~3min. Use Karpenter for GPU workloads.",
     ]},
   ]},
  {week:11,phase:"ADVANCED",phaseColor:"#FACC15",pillar:"P1",hours:28,title:"AI Observability, Security & Compliance",
   skills:["LLM observability: LangFuse, Arize Phoenix","Prompt injection detection + guardrails","Model drift: Evidently AI, whylogs","AI-specific RBAC + audit logging","SOC2/GDPR patterns"],
   projects:[
     {name:"AI Observability Stack",desc:"LangFuse + Evidently + Grafana: token costs, latency, drift score, error rate per model.",hard:true},
     {name:"Guardrails Gateway",desc:"NeMo Guardrails intercepting LLM requests. Block prompt injections. OPA RBAC policies.",hard:false},
   ],
   tools:["LangFuse","Evidently AI","NeMo Guardrails","OPA","Falco"],
   resources:[
     {type:"docs",label:"LangFuse Self-Hosting",url:"https://langfuse.com/docs/deployment/self-host",note:"Helm deployment on k8s."},
     {type:"docs",label:"OWASP LLM Top 10",url:"https://owasp.org/www-project-top-10-for-large-language-model-applications/",note:"The AI security threat model."},
     {type:"course",label:"Red Teaming LLM Apps (FREE)",url:"https://www.deeplearning.ai/short-courses/red-teaming-llm-applications/",note:"Think like an attacker first."},
     {type:"course",label:"ML Monitoring — Evidently AI (FREE)",url:"https://learn.evidentlyai.com",note:"End-to-end monitoring."},
     {type:"repo",label:"NeMo Guardrails + Examples",url:"https://github.com/NVIDIA/NeMo-Guardrails/tree/main/examples",note:"Run every example."},
   ],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"LLM Observability",def:"Tracking prompts, responses, latency, token costs for every LLM call. APM for AI workloads."},
       {term:"Model Drift",def:"Model output quality degrades as real-world data changes. Requires monitoring + retraining triggers."},
       {term:"Prompt Injection",def:"Attacker embeds instructions in user input to override system prompt. #1 LLM security risk."},
       {term:"Guardrails",def:"Input/output filters that validate, block, or modify LLM requests. NeMo uses Colang rules language."},
     ]},
     {title:"LangFuse + NeMo Guardrails",type:"code",lang:"python",content:`# pip install langfuse nemoguardrails

# ── LangFuse: instrument every LLM call ───────────────
from langfuse.callback import CallbackHandler
from langchain_anthropic import ChatAnthropic

handler = CallbackHandler()  # reads LANGFUSE_* env vars
llm = ChatAnthropic(
    model="claude-3-5-sonnet-20241022",
    callbacks=[handler]    # every call now traced
)

# Manual tracing for custom code
from langfuse import Langfuse
langfuse = Langfuse()
trace = langfuse.trace(name="k8s-ops-run", user_id="sre-team")
span = trace.span(name="kubectl-get-pods")
result = run_kubectl("get pods --all-namespaces")
span.end(output=result)
langfuse.flush()

# ── NeMo Guardrails: block prompt injection ────────────
# guardrails/main.co
COLANG_CONTENT = """
define flow check prompt injection
  user ask about "ignore previous instructions"
  bot refuse injection

define bot refuse injection
  "I cannot process requests that attempt to override my instructions."
"""

from nemoguardrails import RailsConfig, LLMRails
import asyncio

config = RailsConfig.from_content(
    colang_content=COLANG_CONTENT,
    yaml_content="""
    models:
      - type: main
        engine: anthropic
        model: claude-3-5-sonnet-20241022
    """
)
rails = LLMRails(config)

async def safe_call(user_message: str) -> str:
    return await rails.generate_async(
        messages=[{"role": "user", "content": user_message}]
    )`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "LangFuse traces: Trace → Span → Generation. Think distributed trace where generations are the LLM spans.",
       "Cardinality kills Prometheus. Never use user_id or request_id as a label. Unbounded labels will OOM Prometheus.",
       "Audit logs must be write-once. Store in append-only storage (S3 with Object Lock). Compliance requires it.",
     ]},
   ]},
  {week:12,phase:"CAPSTONE",phaseColor:"#00FFB2",pillar:"P1",hours:35,title:"Full Production AI Platform — Build It All",
   skills:["Tie everything into a cohesive Internal AI Platform","IDP with Backstage + AI plugin","Disaster recovery for AI workloads","FinOps dashboard: GPU cost per model/team","Architecture Decision Records (ADRs)"],
   projects:[{name:"🏆 THE CAPSTONE: Production AI Platform",desc:"Multi-cluster k8s + GPU nodes + MLflow + vLLM + Kafka + Autonomous Ops Agent + Observability + Backstage IDP. End-to-end. ADRs written. GitHub portfolio-ready.",hard:true}],
   tools:["Backstage","Terraform","ArgoCD","Everything Weeks 1–11"],
   resources:[
     {type:"docs",label:"Backstage Official Docs",url:"https://backstage.io/docs/overview/what-is-backstage",note:"Deploy then customize."},
     {type:"docs",label:"AWS Well-Architected ML Lens (FREE)",url:"https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/welcome.html",note:"Audit your architecture."},
     {type:"course",label:"PlatformCon 2024 Talks (FREE)",url:"https://platformcon.com/talks",note:"100+ talks. Filter: Backstage, IDP, AI."},
     {type:"video",label:"Backstage Deep Dive — TechWorld Nana",url:"https://www.youtube.com/watch?v=USB7I7mKRsA",note:"Best Backstage getting-started."},
     {type:"book",label:"Team Topologies — Manuel Pais",url:"https://teamtopologies.com/book",note:"Read Part 2."},
   ],
   content:[
     {title:"Capstone Architecture Checklist",type:"tips",items:[
       "✅ Multi-cluster: management (ArgoCD+Backstage) + workload clusters (AI + GPU)",
       "✅ GitOps end-to-end: no human runs kubectl apply in prod. ArgoCD is the only deployer.",
       "✅ LLM Serving: vLLM on GPU cluster, Kong gateway, rate limiting, Prometheus metrics",
       "✅ MLOps: MLflow + DVC + MinIO, GitHub Actions pipeline, quality gates, Slack notifications",
       "✅ Feature pipeline: Kafka → processing → Feast online store → inference endpoint",
       "✅ AI Agents: K8s ops agent + FinOps agent with MCP tools and Slack approval",
       "✅ Observability: LangFuse traces, Evidently drift detection, DCGM GPU metrics",
       "✅ Security: NeMo Guardrails, OPA RBAC, Falco runtime, audit logs",
       "✅ IDP: Backstage catalog with all services, ADRs documented, runbooks in TechDocs",
       "✅ GitHub: clean READMEs, architecture diagrams, deployment instructions",
     ]},
     {title:"Backstage: Quick Deploy",type:"code",lang:"bash",content:`# Create Backstage app
npx @backstage/create-app@latest
cd my-backstage

# Build and deploy to k8s
yarn install --frozen-lockfile
yarn build:backend
docker build -t backstage:latest -f packages/backend/Dockerfile .

kubectl create namespace platform
kubectl apply -f backstage-deployment.yaml
kubectl port-forward svc/backstage 7007:7007 -n platform

# catalog-info.yaml (add to every service repo)
# apiVersion: backstage.io/v1alpha1
# kind: Component
# metadata:
#   name: vllm-serving
#   annotations:
#     backstage.io/techdocs-ref: dir:.
# spec:
#   type: service
#   lifecycle: production
#   owner: ml-platform-team`},
   ]},
];

// ═══════════════════════════════════════════════════════════════════════════════
// PLAN 2 — CTO BLUEPRINT: STREAMCORE (16 WEEKS)
// ═══════════════════════════════════════════════════════════════════════════════

const CTO_ARCH_STACK=[
  {layer:"FRONTEND",items:["React + Next.js","CloudFront CDN","S3 Static"]},
  {layer:"API GATEWAY",items:["Kong Gateway","JWT Auth","Rate Limiting","WAF"]},
  {layer:"MICROSERVICES",items:["User (Node)","Content (Go)","Stream (Python)","Payment (Java)","Notification (Node)","Recommend (ML)"]},
  {layer:"SERVICE MESH",items:["Istio mTLS","Traffic Shaping","Circuit Breaker","Canary Deploys"]},
  {layer:"DATA",items:["PostgreSQL (RDS)","MongoDB (DocDB)","Redis (ElastiCache)","Kafka (MSK)","S3 Media"]},
  {layer:"PLATFORM",items:["AWS EKS","Terraform IaC","ArgoCD GitOps","GitHub Actions","Vault Secrets"]},
  {layer:"OBSERVABILITY",items:["Prometheus","Grafana","Jaeger Tracing","Loki Logs","PagerDuty"]},
  {layer:"SECURITY",items:["OPA Gatekeeper","Falco Runtime","Trivy Scan","GuardDuty","SOC2 Audit"]},
];

const CTO_PHASES=[
  {id:"C1",week:"1–2",color:"#00FFB2",icon:"◈",title:"AWS Foundation & EKS Cluster",
   goal:"Production AWS account, VPC, EKS cluster with all networking wired up.",
   skills:["AWS account hardening: root lockdown, MFA, billing alerts","VPC: public/private subnets, NAT gateway, bastion","EKS via Terraform: managed node groups, IRSA, autoscaler","kubectl access, kubeconfig, namespaces strategy","AWS LB Controller + ExternalDNS + cert-manager"],
   projects:[
     {name:"Production VPC + EKS",desc:"Terraform: VPC 3 AZs, private/public subnets, EKS 1.29, managed node groups (spot + on-demand), cluster autoscaler.",hard:true},
     {name:"Ingress Stack",desc:"AWS LB Controller + ExternalDNS (Route53) + cert-manager (Let's Encrypt). HTTPS on streamcore.yourdomain.com.",hard:false},
   ],
   tools:["Terraform","AWS EKS","kubectl","Helm","cert-manager"],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"EKS",def:"AWS-managed Kubernetes. AWS runs the control plane. You manage node groups. Use managed node groups for simplicity."},
       {term:"IRSA",def:"IAM Roles for Service Accounts. Pods get AWS permissions via annotations. No static credentials ever."},
       {term:"VPC CIDR Design",def:"Plan for growth: /16 VPC → /24 subnets per AZ. Private subnets for pods/DBs. Public for load balancers only."},
       {term:"AWS LB Controller",def:"Creates ALB/NLB from Kubernetes Ingress/Service objects. AWS-native load balancing."},
     ]},
     {title:"Terraform: VPC + EKS",type:"code",lang:"bash",content:`# Project structure
mkdir -p streamcore-infra/{modules/{vpc,eks,rds,redis},envs/{dev,staging,prod}}

# Bootstrap S3 backend (run once)
aws s3 mb s3://streamcore-tfstate --region us-east-1
aws s3api put-bucket-versioning --bucket streamcore-tfstate \\
  --versioning-configuration Status=Enabled
aws dynamodb create-table --table-name streamcore-tflock \\
  --attribute-definitions AttributeName=LockID,AttributeType=S \\
  --key-schema AttributeName=LockID,KeyType=HASH \\
  --billing-mode PAY_PER_REQUEST

# VPC module (modules/vpc/main.tf)
# Uses: terraform-aws-modules/vpc/aws ~> 5.0
# Private subnets tagged for EKS internal-elb
# Public subnets tagged for EKS elb

# EKS module (modules/eks/main.tf)
# Uses: terraform-aws-modules/eks/aws ~> 20.0
# cluster_version = "1.29"
# enable_irsa = true
# Two node groups:
#   system: m5.large on-demand, min 2 / max 4
#   app: m5.xlarge SPOT, min 2 / max 20

terraform init
terraform plan -out=tfplan
terraform apply tfplan`},
     {title:"Ingress + TLS",type:"code",lang:"bash",content:`# Install AWS Load Balancer Controller
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \\
  -n kube-system \\
  --set clusterName=streamcore-prod \\
  --set serviceAccount.create=false \\
  --set serviceAccount.name=aws-load-balancer-controller

# Install cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \\
  --namespace cert-manager --create-namespace \\
  --set installCRDs=true

# ClusterIssuer for Let's Encrypt
kubectl apply -f - << 'EOF'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your@email.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: alb
EOF`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "EKS control plane costs ~$72/month regardless of nodes. Dev: use spot instances to keep total under $50/month.",
       "IRSA > environment variables > instance profiles. Never put AWS keys in k8s secrets.",
       "NAT gateway costs $0.045/GB transferred. Use VPC endpoints for S3/DynamoDB to eliminate NAT costs.",
       "Spot instances get 2-minute interruption notice. Keep critical pods on on-demand, batch on spot.",
     ]},
   ]},
  {id:"C2",week:"3–4",color:"#FF6B35",icon:"⬡",title:"Microservices — Design, Build & Deploy",
   goal:"6 microservices deployed on EKS with resource limits, health checks, HPA, and Kong routing traffic.",
   skills:["Microservice design: bounded contexts, API contracts","Dockerfile: multi-stage builds, non-root, minimal images","k8s: Deployments, Services, HPA, PDB, resource limits","ConfigMaps vs Secrets vs Vault","Kong API Gateway: routing, JWT, rate limiting per service"],
   projects:[
     {name:"6 Microservices on EKS",desc:"User, Content, Stream, Payment, Notification, Recommendation. Each with Dockerfile, Helm chart, HPA, PDB, health checks. Kong routing.",hard:true},
     {name:"GitHub Actions CI",desc:"Per-service: lint → test → Trivy scan → build Docker → push ECR → update Helm tag → ArgoCD deploys.",hard:false},
   ],
   tools:["Docker","ECR","Helm","Kong","GitHub Actions","ArgoCD"],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Bounded Context",def:"Each microservice owns its data and domain. Never share databases between services."},
       {term:"Multi-stage Docker",def:"Build stage (fat image) → Runtime stage (minimal). Go binary in scratch = 8MB vs 800MB in golang:latest."},
       {term:"HPA",def:"Horizontal Pod Autoscaler. Scales replicas on CPU/memory/custom metrics. Always set this."},
       {term:"PDB",def:"Pod Disruption Budget. Guarantees minimum available pods during node drains. Set minAvailable:1 for all prod services."},
     ]},
     {title:"Dockerfile + CI Pipeline",type:"code",lang:"bash",content:`# User Service (Node.js) — multi-stage
cat > services/user-service/Dockerfile << 'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
RUN addgroup -g 1001 app && adduser -u 1001 -G app -D appuser
WORKDIR /app
COPY --from=builder --chown=appuser:app /app/node_modules ./node_modules
COPY --chown=appuser:app . .
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "src/index.js"]
EOF

# Content Service (Go) — minimal scratch image
cat > services/content-service/Dockerfile << 'EOF'
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o content-service ./cmd/server

FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/content-service /content-service
EXPOSE 8080
ENTRYPOINT ["/content-service"]
EOF

# Build and push all services to ECR
AWS_ID=$(aws sts get-caller-identity --query Account --output text)
ECR="$AWS_ID.dkr.ecr.us-east-1.amazonaws.com"
aws ecr get-login-password | docker login --username AWS --password-stdin \\${ECR}

for svc in user-service content-service stream-service payment-service; do
  aws ecr create-repository --repository-name "streamcore/\\${svc}"
  docker build -t \\${ECR}/streamcore/\\${svc}:latest services/\\${svc}/
  docker push \\${ECR}/streamcore/\\${svc}:latest
done`},
     {title:"Kubernetes Deployment with HPA + PDB",type:"code",lang:"yaml",content:`apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: user-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0    # zero downtime
      maxSurge: 1
  template:
    metadata:
      labels:
        app: user-service
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
      containers:
      - name: user-service
        image: ECR_REGISTRY/streamcore/user-service:TAG
        resources:
          requests: {cpu: "100m", memory: "128Mi"}
          limits:   {cpu: "500m", memory: "512Mi"}
        readinessProbe:
          httpGet: {path: /health/ready, port: 3000}
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet: {path: /health/live, port: 3000}
          initialDelaySeconds: 30
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target: {type: Utilization, averageUtilization: 70}
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: user-service-pdb
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: user-service`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "Use OIDC for GitHub Actions → AWS auth. Never store AWS access keys in GitHub secrets.",
       "Set CPU requests to ~25% of expected normal load. Set limits to 2x requests.",
       "readinessProbe failing = pod removed from Service (no traffic). livenessProbe failing = pod restarted.",
       "Helm values-prod.yaml in git = your CD config. ArgoCD watches this. Never kubectl apply manually in prod.",
     ]},
   ]},
  {id:"C3",week:"5–6",color:"#A855F7",icon:"◉",title:"Data Layer — PostgreSQL, Redis, Kafka",
   goal:"Full data layer: relational DB, distributed cache, event streaming — all production-hardened.",
   skills:["RDS PostgreSQL: multi-AZ, read replicas, PgBouncer pooling","ElastiCache Redis: cluster mode, eviction, distributed locking","Amazon MSK Kafka: topics, consumer groups, Schema Registry","Database migrations: Flyway without downtime","Event-driven patterns between services"],
   projects:[
     {name:"Multi-DB Data Layer",desc:"RDS PostgreSQL + ElastiCache Redis cluster. Terraform. PgBouncer connection pooling. Automated backups.",hard:true},
     {name:"Event-Driven Services",desc:"MSK Kafka. User events → Kafka → Notification service consumers. Schema Registry enforcing Avro schemas.",hard:true},
   ],
   tools:["AWS RDS","ElastiCache","MSK","PgBouncer","Kafka"],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Multi-AZ RDS",def:"Synchronous replication to standby in another AZ. Auto-failover in 60-120s. Non-negotiable for prod."},
       {term:"PgBouncer",def:"Connection pooler for PostgreSQL. Reduces actual DB connections from thousands to tens."},
       {term:"Redis Eviction",def:"allkeys-lru = evict least recently used when memory full. For caching use this. For sessions use noeviction."},
       {term:"Exactly-Once Kafka",def:"Idempotent producers + transactional API. No duplicates even on failure. Use for payment events."},
     ]},
     {title:"Terraform: RDS + ElastiCache",type:"code",lang:"bash",content:`# RDS PostgreSQL (modules/rds/main.tf)
resource "aws_db_instance" "main" {
  identifier        = "streamcore-prod-postgres"
  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = "db.r6g.large"
  allocated_storage = 100
  storage_encrypted = true

  multi_az               = true    # HA - required for prod
  backup_retention_period = 7
  deletion_protection    = true
  performance_insights_enabled = true
}

# ElastiCache Redis (modules/redis/main.tf)
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "streamcore-prod-redis"
  node_type            = "cache.r7g.large"
  num_cache_clusters   = 3
  automatic_failover_enabled = true
  multi_az_enabled           = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
}

# MSK Kafka (modules/kafka/main.tf)
resource "aws_msk_cluster" "main" {
  cluster_name           = "streamcore-prod"
  kafka_version          = "3.5.1"
  number_of_broker_nodes = 3
  broker_node_group_info {
    instance_type = "kafka.m5.large"
    storage_info {
      ebs_storage_info {
        volume_size = 1000
      }
    }
  }
  encryption_info {
    encryption_in_transit {
      client_broker = "TLS"
    }
  }
}`},
     {title:"Redis Cache-Aside Pattern",type:"code",lang:"python",content:`import redis, json, time

r = redis.Redis(
    host='streamcore-redis.xxx.cache.amazonaws.com',
    port=6379, ssl=True,
    password='YOUR_AUTH_TOKEN'
)

# Cache-aside pattern
def get_with_cache(key, ttl_seconds, fetch_fn):
    cached = r.get(key)
    if cached:
        return json.loads(cached)
    # Cache miss
    data = fetch_fn()
    r.setex(key, ttl_seconds, json.dumps(data))
    return data

# Usage
user = get_with_cache(
    f'user:{user_id}',
    300,  # 5 minutes
    lambda: db.users.find_by_id(user_id)
)

# PgBouncer connection pooling deployment
# All services connect to pgbouncer:5432, not RDS directly
# PgBouncer opens max 20 real connections to RDS
# 100 pods think they each have a connection — pool manages it
# Config: pool_mode = transaction (best for microservices)`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "RDS Multi-AZ failover = 60-120 seconds. Your app MUST handle transient DB connection failures with retry.",
       "Redis cluster mode: use hash tags {user}:profile so multi-key commands land on same slot.",
       "PgBouncer transaction mode: prepared statements DON'T work. Disable in your ORM.",
       "Never store session data in PostgreSQL. Use Redis. DB is the bottleneck.",
     ]},
   ]},
  {id:"C4",week:"7–8",color:"#00FFB2",icon:"◈",title:"Service Mesh — Istio, mTLS & Canary Deploys",
   goal:"Istio installed, all services on mTLS, Flagger canary deployments, circuit breakers active.",
   skills:["Istio: control plane (istiod), data plane (Envoy)","mTLS: auto cert rotation, PeerAuthentication","Traffic management: VirtualServices, DestinationRules","Circuit breaking + retry policies","Flagger: automated canary analysis"],
   projects:[
     {name:"Full Istio Service Mesh",desc:"Istio on EKS, all namespaces injected, STRICT mTLS cluster-wide, Kiali dashboard.",hard:true},
     {name:"Flagger Canary Pipeline",desc:"Content service canary: 10% → auto-promote if error rate <1%, auto-rollback if >5%. Driven by Flagger.",hard:true},
   ],
   tools:["Istio","Envoy","Kiali","Flagger"],
   content:[
     {title:"Flagger Automated Canary",type:"code",lang:"yaml",content:`apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: content-service
  namespace: content-service
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: content-service
  service:
    port: 80
    hosts: [content.streamcore.com]
    gateways: [istio-system/main-gateway]
  analysis:
    interval: 1m
    threshold: 5          # fail after 5 bad checks
    maxWeight: 50         # max 50% canary traffic
    stepWeight: 10        # +10% per interval
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99           # rollback if <99% success
      interval: 1m
    - name: request-duration
      thresholdRange:
        max: 500          # rollback if p99 >500ms
      interval: 1m
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: content-service
spec:
  host: content-service
  trafficPolicy:
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
    connectionPool:
      tcp: {maxConnections: 100}
      http: {http2MaxRequests: 1000}`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "STRICT mTLS breaks services calling external HTTP endpoints. Use ServiceEntry to declare external services.",
       "Flagger needs Prometheus for canary analysis. Install Prometheus first or Flagger can't auto-promote.",
       "Envoy sidecars add ~2-5ms latency per hop. Acceptable for most use cases.",
     ]},
   ]},
  {id:"C5",week:"9–10",color:"#FF6B35",icon:"⬡",title:"Full Observability — Metrics, Traces, Logs, SLOs",
   goal:"Every request traced end-to-end, every service has SLOs, dashboards for latency/errors/saturation.",
   skills:["Prometheus + Grafana: RED method dashboards, recording rules","Distributed tracing: Jaeger with OpenTelemetry in all services","Centralized logging: Loki + Promtail, structured JSON, correlation IDs","SLOs and error budgets: burn rate alerts","PagerDuty integration + runbooks"],
   projects:[
     {name:"Full O11y Stack",desc:"Prometheus + Grafana + Loki + Jaeger on k8s. RED dashboards for all 6 services, DB pool utilization.",hard:true},
     {name:"SLO Dashboard + Alerts",desc:"SLOs per service (99.9% availability, p99 <500ms). Error budget burn rate alerts. PagerDuty routing.",hard:false},
   ],
   tools:["Prometheus","Grafana","Loki","Jaeger","OpenTelemetry","PagerDuty"],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"RED Method",def:"Rate (req/sec), Errors (error rate %), Duration (latency). The three metrics every service must expose."},
       {term:"SLO",def:"Service Level Objective. Internal target: 99.9% of requests < 500ms over 30 days."},
       {term:"Error Budget",def:"How much downtime you can afford. 99.9% = 43min/month. Burn rate alert fires when budget exhausts in <1hr."},
       {term:"Correlation ID",def:"UUID added at API gateway, passed through all services. Ties all logs for one user request together."},
     ]},
     {title:"Deploy kube-prometheus-stack + Loki",type:"code",lang:"bash",content:`# kube-prometheus-stack (Prometheus + Grafana + Alertmanager)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \\
  --namespace monitoring --create-namespace \\
  --set grafana.adminPassword=changeme-in-prod \\
  --set prometheus.prometheusSpec.retention=30d \\
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=100Gi

# Loki (log aggregation)
helm install loki grafana/loki-stack \\
  --namespace monitoring \\
  --set promtail.enabled=true \\
  --set loki.persistence.enabled=true \\
  --set loki.persistence.size=50Gi

# Jaeger (distributed tracing)
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm install jaeger jaegertracing/jaeger \\
  --namespace monitoring \\
  --set allInOne.enabled=true \\
  --set storage.type=elasticsearch   # use ES in prod

# SLO burn rate alert
kubectl apply -f - << 'EOF'
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: streamcore-slos
  namespace: monitoring
spec:
  groups:
  - name: slos
    rules:
    - alert: SLOBurnRateHigh
      expr: |
        sum(rate(http_requests_total{status!~"5.."}[5m])) /
        sum(rate(http_requests_total[5m])) < 0.986
      for: 2m
      labels:
        severity: critical
      annotations:
        summary: "SLO burn rate too high — exhausting error budget"
EOF`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "Cardinality kills Prometheus. Never use user_id as a label. Unbounded labels OOM your Prometheus.",
       "Structured JSON logs are mandatory. log.info('msg', {userId, correlationId, duration}) not log.info('user 123 took 23ms').",
       "Jaeger: 100% sampling in dev, 1-10% in prod. Always sample 100% of errors regardless of rate.",
       "Set up PagerDuty BEFORE going to prod. You can't set up alerting fast enough during an actual incident.",
     ]},
   ]},
  {id:"C6",week:"11–12",color:"#A855F7",icon:"◉",title:"Security — Vault, OPA, Trivy, Falco",
   goal:"Zero-trust posture: no hardcoded secrets, image scanning, runtime threat detection, admission control.",
   skills:["HashiCorp Vault: dynamic secrets, PKI, Agent injection","OPA Gatekeeper: admission control policies","Trivy image scanning in CI","Falco: runtime container security","AWS GuardDuty + Security Hub"],
   projects:[
     {name:"Vault + Dynamic Secrets",desc:"Vault on k8s. DB credentials created per-pod, auto-rotated. Vault Agent injects. Zero static credentials.",hard:true},
     {name:"Security Hardening Suite",desc:"OPA Gatekeeper policies + Trivy in CI + Falco runtime detection. Security score dashboard.",hard:false},
   ],
   tools:["HashiCorp Vault","OPA Gatekeeper","Trivy","Falco","GuardDuty"],
   content:[
     {title:"Key Concepts",type:"concept",items:[
       {term:"Dynamic Secrets",def:"Vault creates DB credentials on-demand per pod. Auto-expire when pod dies. Even if leaked, useless in minutes."},
       {term:"Vault Agent",def:"Sidecar injected by Vault Agent Injector. Authenticates via k8s SA, writes secrets to shared volume. App reads files."},
       {term:"OPA Gatekeeper",def:"Validates/mutates k8s resources at creation. Enforce: no latest tags, required resource limits, no privileged containers."},
       {term:"Falco",def:"Runtime security. Watches kernel syscalls. Alerts on: unexpected network connections, shell in container, /etc changes."},
     ]},
     {title:"Vault Setup + Dynamic DB Secrets",type:"code",lang:"bash",content:`# Install Vault on k8s (HA mode)
helm repo add hashicorp https://helm.releases.hashicorp.com
helm install vault hashicorp/vault \\
  --namespace vault --create-namespace \\
  --set server.ha.enabled=true \\
  --set server.ha.replicas=3 \\
  --set injector.enabled=true

# Initialize Vault
kubectl exec -n vault vault-0 -- vault operator init \\
  -key-shares=5 -key-threshold=3 -format=json > vault-keys.json

# Store keys in AWS Secrets Manager immediately!
aws secretsmanager create-secret --name streamcore/vault/keys \\
  --secret-string file://vault-keys.json

# Configure k8s auth
kubectl exec -n vault vault-0 -- vault auth enable kubernetes
kubectl exec -n vault vault-0 -- vault write auth/kubernetes/config \\
  kubernetes_host="https://KUBERNETES_API:443"

# Enable PostgreSQL dynamic secrets
kubectl exec -n vault vault-0 -- vault secrets enable database
kubectl exec -n vault vault-0 -- vault write database/roles/user-service \\
  db_name=streamcore-postgres \\
  default_ttl="1h" max_ttl="24h"

# Pod annotations to inject credentials
# vault.hashicorp.com/agent-inject: "true"
# vault.hashicorp.com/role: "user-service"
# vault.hashicorp.com/agent-inject-secret-db: "database/creds/user-service"`},
     {title:"OPA + Trivy Policies",type:"code",lang:"bash",content:`# Install OPA Gatekeeper
helm install gatekeeper opa/gatekeeper \\
  --namespace gatekeeper-system --create-namespace

# Policy: no 'latest' tags
kubectl apply -f - << 'EOF'
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sDisallowedTags
metadata:
  name: no-latest-tags
spec:
  match:
    kinds: [{apiGroups: ["apps"], kinds: ["Deployment"]}]
  parameters:
    tags: ["latest"]
EOF

# Policy: require resource limits
kubectl apply -f - << 'EOF'
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredResources
metadata:
  name: require-resource-limits
spec:
  match:
    kinds: [{apiGroups: [""], kinds: ["Pod"]}]
  parameters:
    limits: [cpu, memory]
    requests: [cpu, memory]
EOF

# Trivy in GitHub Actions CI
# - name: Scan image
#   uses: aquasecurity/trivy-action@master
#   with:
#     image-ref: ECR_REGISTRY/service:TAG
#     exit-code: 1
#     severity: CRITICAL,HIGH
#     ignore-unfixed: true`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "Auto-unseal Vault with AWS KMS in prod. Manual unseal = if all vault pods restart, you're locked out.",
       "OPA Gatekeeper: run in 'dryrun' mode first to audit violations, then switch to 'deny'. Never go straight to deny.",
       "Trivy ignore-unfixed is important. Only fail on CVEs with available patches.",
       "Rotate ALL secrets on day 1 of a security incident. Vault dynamic secrets = only the current pod is compromised.",
     ]},
   ]},
  {id:"C7",week:"13–14",color:"#FACC15",icon:"◆",title:"Performance, Scale & Chaos Engineering",
   goal:"Load test to 10,000 concurrent users, find and fix all bottlenecks, chaos tests running in CI.",
   skills:["k6 load testing: realistic user journeys, thresholds","Profiling: Node.js clinic.js, Go pprof","DB optimization: EXPLAIN ANALYZE, indexes","CloudFront for API response caching","Chaos engineering automated in CI"],
   projects:[
     {name:"10K User Load Test",desc:"k6 script: signup → login → browse → stream. Run against staging. Fix bottlenecks. p99 <500ms at 10K.",hard:true},
     {name:"Chaos Test Suite in CI",desc:"Chaos Mesh: pod kill, network partition, DB failover. Run weekly. Assert SLO recovery in 60 seconds.",hard:false},
   ],
   tools:["k6","Chaos Mesh","CloudFront","Go pprof"],
   content:[
     {title:"k6 Load Test: User Journey",type:"code",lang:"bash",content:`# brew install k6 (Mac) or snap install k6 (Linux)

cat > load-tests/journey.js << 'JSEOF'
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100   },
    { duration: '5m', target: 1000  },
    { duration: '5m', target: 5000  },
    { duration: '5m', target: 10000 },
    { duration: '3m', target: 0     },
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'],  // p99 < 500ms
    http_req_failed: ['rate<0.01'],    // < 1% errors
  },
};

const BASE = 'https://api.streamcore.com';

export default function () {
  // Login
  const loginRes = http.post(BASE + '/users/login',
    JSON.stringify({email: 'test@test.com', password: 'Test1234!'}),
    {headers: {'Content-Type': 'application/json'}});
  const token = loginRes.json('token');
  check(loginRes, { 'login 200': r => r.status === 200 });

  const headers = { Authorization: 'Bearer ' + token };
  sleep(1);

  // Browse content
  const contentRes = http.get(BASE + '/content?page=1', {headers});
  check(contentRes, { 'content 200': r => r.status === 200 });
  sleep(2);

  // Stream
  const contentId = contentRes.json('items[0].id');
  const streamRes = http.get(BASE + '/stream/' + contentId, {headers});
  errorRate.add(streamRes.status !== 200);
  sleep(30);
}
JSEOF

# Run with Prometheus output
k6 run --out prometheus=http://prometheus:9090/api/v1/write \\
  load-tests/journey.js`},
     {title:"Gotchas & Tips",type:"tips",items:[
       "Load test against staging with prod-scale data. 10 rows in staging DB = false confidence.",
       "Your first load test WILL reveal connection pool exhaustion. It's always the DB or Redis pool.",
       "k6 VUs are goroutines, not browsers. 10K VUs hit API continuously. Scale VUs to match your actual RPS target.",
       "CloudFront in front of API Gateway: even 60-second cache TTL for content listings eliminates 90% of DB reads.",
     ]},
   ]},
  {id:"C8",week:"15–16",color:"#00FFB2",icon:"◈",title:"CTO Capstone — Production Hardening & Docs",
   goal:"StreamCore live on AWS. Load tested. Security hardened. Costs optimized. Architecture documented. CTO portfolio ready.",
   skills:["FinOps: cost tagging, Reserved Instances, Spot savings","DR: RTO/RPO targets, cross-region failover, backup testing","Developer platform: Backstage IDP for StreamCore","C4 architecture diagrams + ADR library","On-call: incident response, blameless postmortems"],
   projects:[
     {name:"🏆 StreamCore — Live on AWS",desc:"All 8 phases deployed. 10K load tested. Security hardened. Costs under $500/month dev, $650/month prod. GitHub portfolio with full docs.",hard:true},
     {name:"CTO Architecture Deck",desc:"5-slide deck: C4 diagrams, FinOps report, SLO dashboard, security posture. The deck you'd present to a board.",hard:false},
   ],
   tools:["Backstage","C4 Model","AWS Cost Explorer","Terraform"],
   content:[
     {title:"CTO Architecture Checklist",type:"tips",items:[
       "✅ Multi-AZ everything: EKS nodes, RDS, ElastiCache, MSK. Single-AZ is an anti-pattern.",
       "✅ Zero hardcoded secrets: Vault dynamic secrets for DB, Secrets Manager for API keys, IRSA for AWS.",
       "✅ GitOps: ArgoCD is the only thing that touches production clusters. No manual kubectl apply.",
       "✅ Every service has: SLO defined, SLO dashboard, burn rate alert, on-call runbook, PDB.",
       "✅ Security: OPA blocks non-compliant deploys, Trivy blocks vulnerable images, Falco monitors runtime.",
       "✅ FinOps: all resources tagged by team/service, monthly cost report, RIs for 6mo+ baseline.",
       "✅ Documented: C4 diagrams, ADRs for every major decision, runbooks for every alert.",
       "✅ Load tested: every service benchmarked at 10x expected traffic. Scaling plan written.",
     ]},
     {title:"Monthly Cost Breakdown",type:"code",lang:"bash",content:`# StreamCore Prod Estimated Costs
echo "
EKS Control Plane:              \$72/month (fixed)
EC2 nodes (3x m5.xlarge spot):  ~\$80/month
RDS Multi-AZ db.r6g.large:      ~\$180/month
ElastiCache cache.r7g.large:    ~\$120/month
MSK (3x kafka.m5.large):        ~\$200/month
ALB:                            ~\$20/month
NAT Gateway (3 AZs):            ~\$35/month
S3 + CloudFront:                ~\$50/month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total on-demand:                ~\$757/month
With Reserved Instances (1yr):  ~\$450/month
With Spot for EC2:              ~\$400/month
"

# Tag everything for cost attribution
# In Terraform provider:
# default_tags {
#   tags = {
#     Project = "streamcore"
#     Environment = var.env
#     Team = var.team
#     Service = var.service
#     ManagedBy = "terraform"
#   }
# }

# Analyze and buy Reserved Instances
aws ce get-reservation-purchase-recommendation \\
  --service "Amazon EC2" \\
  --payment-option ALL_UPFRONT \\
  --lookback-period-in-days THIRTY_DAYS`},
     {title:"DR Runbook",type:"code",lang:"bash",content:`#!/bin/bash
# test-dr.sh — run weekly in CI

echo "=== StreamCore DR Test ==="

# Verify RDS backups exist and are recent
LATEST=$(aws rds describe-db-snapshots \\
  --db-instance-identifier streamcore-prod-postgres \\
  --query 'reverse(sort_by(DBSnapshots,&SnapshotCreateTime))[0].DBSnapshotIdentifier' \\
  --output text)
echo "Latest snapshot: \\\${LATEST}"

# Test restore to temp instance
aws rds restore-db-instance-from-db-snapshot \\
  --db-instance-identifier streamcore-dr-test \\
  --db-snapshot-identifier \\\${LATEST} \\
  --db-instance-class db.t3.micro

aws rds wait db-instance-available \\
  --db-instance-identifier streamcore-dr-test
echo "PASS: DB restore succeeded"

# Cleanup
aws rds delete-db-instance \\
  --db-instance-identifier streamcore-dr-test \\
  --skip-final-snapshot

echo "=== DR Test Complete ==="
# RTO target: 2 hours | RPO target: 15 minutes`},
   ]},
];

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED TRACKER LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

function freshAITracker(){
  const ws={},pr={};
  AI_WEEKS.forEach(w=>{ws[w.week]="not_started";w.projects.forEach((_,i)=>{pr[`${w.week}-${i}`]=false;});});
  return{weekStatus:ws,projects:pr,startDate:new Date().toISOString()};
}
function freshCTOTracker(){
  const ps={},pr={};
  CTO_PHASES.forEach(p=>{ps[p.id]="not_started";p.projects.forEach((_,i)=>{pr[`${p.id}-${i}`]=false;});});
  return{phaseStatus:ps,projects:pr,startDate:new Date().toISOString()};
}

const PCOL={P1:"#00FFB2",P2:"#FF6B35",P3:"#A855F7",P4:"#FACC15"};
const UCOL={NOW:"#00FFB2",SOON:"#FF6B35","NEXT YEAR":"#A855F7"};
const AI_TOTAL_HOURS=AI_WEEKS.reduce((s,w)=>s+w.hours,0);

// ═══════════════════════════════════════════════════════════════════════════════
// AI PLAN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function AIPlan(){
  const [openWeek,setOpenWeek]=useState(null);
  const [innerTab,setInnerTab]=useState({});
  const [mainTab,setMainTab]=useState("roadmap");
  const [resFilter,setResFilter]=useState("all");
  const [tracker,setTracker]=useState(null);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{loadData("ai_plan_v3").then(d=>{setTracker(d||freshAITracker());setLoaded(true);});}, []);
  const save=(n)=>{setTracker(n);saveData("ai_plan_v3",n);};
  const cycleStatus=(wn)=>{
    const cur=tracker?.weekStatus[wn]||"not_started";
    const nxt=cur==="not_started"?"in_progress":cur==="in_progress"?"done":"not_started";
    save({...tracker,weekStatus:{...tracker.weekStatus,[wn]:nxt}});
  };
  const toggleProj=(k)=>save({...tracker,projects:{...tracker.projects,[k]:!tracker.projects?.[k]}});
  const resetT=()=>save(freshAITracker());

  const doneW=tracker?Object.values(tracker.weekStatus).filter(s=>s==="done").length:0;
  const inProgW=tracker?Object.values(tracker.weekStatus).filter(s=>s==="in_progress").length:0;
  const doneP=tracker?Object.values(tracker.projects).filter(Boolean).length:0;
  const doneH=tracker?AI_WEEKS.filter(w=>tracker.weekStatus[w.week]==="done").reduce((s,w)=>s+w.hours,0):0;
  const allProjects=AI_WEEKS.flatMap(w=>w.projects.map((p,i)=>({weekNum:w.week,projIdx:i,name:p.name,hard:p.hard,phase:w.phase,phaseColor:w.phaseColor})));
  const pct=Math.round((doneW/AI_WEEKS.length)*100);
  const getIT=(wn)=>innerTab[wn]||"overview";
  const setIT=(wn,t)=>setInnerTab(p=>({...p,[wn]:t}));

  if(!loaded) return <div style={{color:"#00FFB2",padding:40,textAlign:"center",fontFamily:"monospace",fontSize:11,letterSpacing:3}}>LOADING...</div>;

  return(
    <div>
      {/* Pillars */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:9,marginBottom:26}}>
        {[["12 WEEKS","3-Month Plan"],[`${AI_TOTAL_HOURS} HRS`,"~31h/week"],["4 PILLARS","Core Domains"],[`${pct}%`,"Completed"]].map(([v,l])=>(
          <div key={v} style={{background:"#0D1117",border:"1px solid #00FFB230",borderTop:"3px solid #00FFB2",padding:"12px 14px",borderRadius:4}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#00FFB2"}}>{v}</div>
            <div style={{fontSize:9,color:"#4A5568",letterSpacing:2,textTransform:"uppercase"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:9,marginBottom:26}}>
        {[{id:"P1",label:"AI-Native Platform Eng.",color:"#00FFB2",icon:"◈"},{id:"P2",label:"MLOps & Model Lifecycle",color:"#FF6B35",icon:"⬡"},{id:"P3",label:"AI Agents for Infra",color:"#A855F7",icon:"◉"},{id:"P4",label:"GPU & AI Infra at Scale",color:"#FACC15",icon:"◆"}].map(p=>(
          <div key={p.id} style={{background:"#0D1117",border:`1px solid ${p.color}25`,borderTop:`3px solid ${p.color}`,padding:"12px 14px",borderRadius:4}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}><span style={{color:p.color,fontSize:14}}>{p.icon}</span><span style={{color:p.color,fontSize:9,letterSpacing:2}}>{p.id}</span></div>
            <div style={{fontSize:11,fontWeight:500,color:"#E8EAF0"}}>{p.label}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #1A2030",marginBottom:20}}>
        {[["roadmap","Roadmap"],["tracker","Tracker"]].map(([t,l])=>(
          <button key={t} className="tb" onClick={()=>setMainTab(t)} style={{color:mainTab===t?"#00FFB2":"#4A5568",padding:"10px 16px",fontSize:10,letterSpacing:3,textTransform:"uppercase",borderBottom:mainTab===t?"2px solid #00FFB2":"2px solid transparent",marginBottom:-1}}>
            {l}{t==="tracker"&&doneW>0&&<span style={{marginLeft:5,background:"#00FFB220",color:"#00FFB2",fontSize:8,padding:"1px 4px",borderRadius:2}}>{doneW}/{AI_WEEKS.length}</span>}
          </button>
        ))}
      </div>

      {mainTab==="roadmap"&&(
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {AI_WEEKS.map(w=>{
            const isOn=openWeek===w.week;
            const st=tracker?.weekStatus[w.week]||"not_started";
            const sm=SMETA[st];
            const wProjs=w.projects.map((_,i)=>({k:`${w.week}-${i}`,done:tracker?.projects[`${w.week}-${i}`]||false}));
            const pDone=wProjs.filter(p=>p.done).length;
            const it=getIT(w.week);
            const res=resFilter==="all"?w.resources:w.resources.filter(r=>r.type===resFilter);
            return(
              <div key={w.week}>
                <div className={`wk${isOn?" on":""}`} onClick={()=>setOpenWeek(isOn?null:w.week)}
                  style={{background:"#0D1117",borderRadius:isOn?"4px 4px 0 0":4,padding:"14px 18px",borderLeft:`3px solid ${w.phaseColor}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:7}}>
                    <div style={{display:"flex",alignItems:"center",gap:11}}>
                      <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:w.phaseColor,minWidth:20}}>W{w.week}</span>
                      <div>
                        <div style={{fontSize:12,color:"#E8EAF0"}}>{w.title}</div>
                        <div style={{fontSize:9,color:"#4A5568",marginTop:1}}>{w.phase} · {w.hours}h · {(w.resources||[]).length} refs</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:9,color:sm.tc}}>{sm.dot}</span>
                      <span style={{background:`${PCOL[w.pillar]}12`,color:PCOL[w.pillar],fontSize:8,letterSpacing:2,padding:"2px 7px",borderRadius:2}}>{w.pillar}</span>
                      {pDone>0&&<span style={{fontSize:9,color:"#00FFB2"}}>{pDone}/{w.projects.length}✓</span>}
                      <span style={{color:"#4A5568",fontSize:10}}>{isOn?"▲":"▼"}</span>
                    </div>
                  </div>
                </div>
                {isOn&&(
                  <div style={{background:"#0A0E14",border:"1px solid #1A2030",borderTop:"none",borderRadius:"0 0 4px 4px"}}>
                    <div style={{display:"flex",borderBottom:"1px solid #1A2030",padding:"0 16px"}}>
                      {[["overview","Overview"],["content","📖 Learn"],["resources","References"]].map(([t,l])=>(
                        <button key={t} className="itb" onClick={e=>{e.stopPropagation();setIT(w.week,t);}}
                          style={{color:it===t?"#00FFB2":"#4A5568",padding:"9px 13px",fontSize:9,letterSpacing:2,textTransform:"uppercase",borderBottom:it===t?"2px solid #00FFB2":"2px solid transparent",marginBottom:-1,background:"none",border:"none"}}>
                          {l}
                        </button>
                      ))}
                    </div>
                    <div style={{padding:"16px"}}>
                      {it==="overview"&&(
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                          <div>
                            <div style={{fontSize:9,color:"#00FFB2",letterSpacing:3,marginBottom:8}}>WHAT YOU LEARN</div>
                            {w.skills.map((s,i)=>(
                              <div key={i} style={{display:"flex",gap:7,marginBottom:5,fontSize:11,color:"#A0A8B8",lineHeight:1.45}}>
                                <span style={{color:"#00FFB2",flexShrink:0}}>→</span><span>{s}</span>
                              </div>
                            ))}
                            <div style={{marginTop:12}}>
                              <div style={{fontSize:9,color:"#4A5568",letterSpacing:3,marginBottom:5}}>TOOLS</div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                {w.tools.map(t=><span key={t} style={{background:"#1A2030",color:"#A0A8B8",fontSize:9,padding:"2px 7px",borderRadius:2}}>{t}</span>)}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style={{fontSize:9,color:"#FF6B35",letterSpacing:3,marginBottom:8}}>BUILD THESE PROJECTS</div>
                            {w.projects.map((p,i)=>{
                              const pk=`${w.week}-${i}`;
                              const done=tracker?.projects[pk]||false;
                              return(
                                <div key={i} style={{background:"#0D1117",border:"1px solid #1A2030",borderLeft:`3px solid ${p.hard?"#FF6B35":"#A855F7"}`,padding:"10px 12px",marginBottom:7,borderRadius:"0 4px 4px 0"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                                    <span onClick={e=>{e.stopPropagation();toggleProj(pk);}} className="chk" style={{fontSize:13,color:done?"#00FFB2":"#2A3040"}}>{done?"☑":"☐"}</span>
                                    <span style={{fontSize:11,color:done?"#4A5568":"#E8EAF0",textDecoration:done?"line-through":"none"}}>{p.name}</span>
                                    {p.hard&&<span style={{background:"#FF6B3520",color:"#FF6B35",fontSize:7,padding:"1px 5px",borderRadius:2}}>HARD</span>}
                                  </div>
                                  <div style={{fontSize:10,color:"#4A5568",lineHeight:1.5}}>{p.desc}</div>
                                </div>
                              );
                            })}
                            <button className="sc" onClick={e=>{e.stopPropagation();cycleStatus(w.week);}}
                              style={{background:sm.color,color:sm.tc,fontSize:8,padding:"4px 10px",letterSpacing:2,textTransform:"uppercase",border:`1px solid ${sm.tc}30`,marginTop:8}}>
                              {sm.dot} {sm.label}
                            </button>
                          </div>
                        </div>
                      )}
                      {it==="content"&&<ContentRenderer sections={w.content||[]}/>}
                      {it==="resources"&&(
                        <div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:6}}>
                            <div style={{fontSize:9,color:"#FACC15",letterSpacing:3}}>◆ EXTERNAL REFERENCES ({(w.resources||[]).length})</div>
                            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                              {["all","docs","course","video","book","repo"].map(f=>(
                                <button key={f} className="fb" onClick={e=>{e.stopPropagation();setResFilter(f===resFilter?"all":f);}}
                                  style={{background:resFilter===f?"#FACC1518":"#0D1117",color:resFilter===f?"#FACC15":"#4A5568",border:`1px solid ${resFilter===f?"#FACC1540":"#1A2030"}`,fontSize:8,padding:"3px 7px",letterSpacing:1,textTransform:"uppercase"}}>
                                  {f==="all"?"ALL":RMETA[f]?.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:6}}>
                            {res.map((r,i)=>{
                              const m=RMETA[r.type];
                              return(
                                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="rl"
                                  style={{background:"#0D1117",border:`1px solid ${m.color}20`,borderLeft:`2px solid ${m.color}`,padding:"9px 12px",borderRadius:"0 4px 4px 0"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{color:m.color,fontSize:8}}>{m.icon}</span><span style={{fontSize:8,color:m.color,letterSpacing:2}}>{m.label}</span></div>
                                  <div style={{fontSize:11,color:"#E8EAF0",marginBottom:2}}>{r.label}</div>
                                  <div style={{fontSize:9,color:"#4A5568",lineHeight:1.4}}>{r.note}</div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {mainTab==="tracker"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:20}}>
            {[{l:"WEEKS DONE",v:doneW,t:AI_WEEKS.length,c:"#00FFB2"},{l:"IN PROGRESS",v:inProgW,t:AI_WEEKS.length,c:"#FF6B35"},{l:"PROJECTS",v:doneP,t:allProjects.length,c:"#A855F7"},{l:"HOURS BANKED",v:doneH,t:AI_TOTAL_HOURS,c:"#FACC15"}].map(s=>(
              <div key={s.l} style={{background:"#0D1117",border:`1px solid ${s.c}25`,borderTop:`3px solid ${s.c}`,padding:"12px 14px",borderRadius:4}}>
                <div style={{fontSize:8,color:"#4A5568",letterSpacing:3,marginBottom:5}}>{s.l}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:s.c}}>{s.v}<span style={{fontSize:10,color:"#4A5568",fontFamily:"inherit",fontWeight:400}}> / {s.t}</span></div>
                <div style={{background:"#1A2030",height:3,borderRadius:2,marginTop:6}}><div className="bar" style={{background:s.c,height:"100%",width:`${Math.round((s.v/s.t)*100)}%`,borderRadius:2}}/></div>
              </div>
            ))}
          </div>
          <div style={{background:"#0D1117",border:"1px solid #00FFB230",borderRadius:4,padding:"12px 16px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:9,color:"#00FFB2",letterSpacing:3}}>COMPLETION</span><span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#00FFB2"}}>{pct}%</span></div>
            <div style={{background:"#1A2030",height:6,borderRadius:3}}><div className="bar" style={{background:"linear-gradient(90deg,#00FFB2,#A855F7)",height:"100%",width:`${pct}%`,borderRadius:3}}/></div>
            {tracker?.startDate&&<div style={{fontSize:9,color:"#4A5568",marginTop:6}}>Started: {new Date(tracker.startDate).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>}
          </div>
          <div style={{fontSize:9,color:"#4A5568",letterSpacing:3,marginBottom:9}}>CLICK STATUS TO CYCLE</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {AI_WEEKS.map(w=>{
              const st=tracker?.weekStatus[w.week]||"not_started";
              const sm=SMETA[st];
              const wp=w.projects.map((_,i)=>({k:`${w.week}-${i}`,done:tracker?.projects[`${w.week}-${i}`]||false}));
              const pd=wp.filter(p=>p.done).length;
              return(
                <div key={w.week} style={{background:"#0D1117",border:"1px solid #1A2030",borderRadius:4,padding:"10px 14px",borderLeft:`3px solid ${w.phaseColor}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,color:w.phaseColor}}>W{w.week}</span>
                      <div><div style={{fontSize:11,color:"#E8EAF0"}}>{w.title}</div><div style={{fontSize:9,color:"#4A5568"}}>{w.hours}h</div></div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      {wp.map(p=><span key={p.k} onClick={()=>toggleProj(p.k)} className="chk" style={{fontSize:13,color:p.done?"#00FFB2":"#2A3040"}}>{p.done?"☑":"☐"}</span>)}
                      <span style={{fontSize:9,color:"#4A5568"}}>{pd}/{w.projects.length}</span>
                      <button className="sc" onClick={()=>cycleStatus(w.week)} style={{background:sm.color,color:sm.tc,fontSize:8,padding:"3px 8px",letterSpacing:2,textTransform:"uppercase",border:`1px solid ${sm.tc}30`}}>{sm.dot} {sm.label}</button>
                    </div>
                  </div>
                  <div style={{marginTop:6,background:"#1A2030",height:2,borderRadius:1}}><div className="bar" style={{background:w.phaseColor,height:"100%",width:`${w.projects.length?Math.round((pd/w.projects.length)*100):0}%`,borderRadius:1}}/></div>
                </div>
              );
            })}
          </div>
          <div style={{textAlign:"center",paddingTop:12,marginTop:12,borderTop:"1px solid #1A2030"}}>
            <button onClick={()=>{if(window.confirm("Reset AI plan progress?"))resetT();}} style={{background:"transparent",color:"#4A5568",border:"1px solid #1A2030",fontSize:9,padding:"7px 14px",letterSpacing:2,cursor:"pointer",borderRadius:3}}>↺ RESET</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CTO PLAN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function CTOPlan(){
  const [openPhase,setOpenPhase]=useState(null);
  const [innerTab,setInnerTab]=useState({});
  const [mainTab,setMainTab]=useState("roadmap");
  const [tracker,setTracker]=useState(null);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{loadData("cto_plan_v2").then(d=>{setTracker(d||freshCTOTracker());setLoaded(true);});}, []);
  const save=(n)=>{setTracker(n);saveData("cto_plan_v2",n);};
  const cycleStatus=(pid)=>{
    const cur=tracker?.phaseStatus[pid]||"not_started";
    const nxt=cur==="not_started"?"in_progress":cur==="in_progress"?"done":"not_started";
    save({...tracker,phaseStatus:{...tracker.phaseStatus,[pid]:nxt}});
  };
  const toggleProj=(k)=>save({...tracker,projects:{...tracker.projects,[k]:!tracker.projects?.[k]}});
  const resetT=()=>save(freshCTOTracker());

  const doneP=tracker?Object.values(tracker.phaseStatus).filter(s=>s==="done").length:0;
  const totalProj=CTO_PHASES.reduce((s,p)=>s+p.projects.length,0);
  const doneProj=tracker?Object.values(tracker.projects).filter(Boolean).length:0;
  const pct=Math.round((doneP/CTO_PHASES.length)*100);
  const getIT=(pid)=>innerTab[pid]||"overview";
  const setIT=(pid,t)=>setInnerTab(p=>({...p,[pid]:t}));

  if(!loaded) return <div style={{color:"#A855F7",padding:40,textAlign:"center",fontFamily:"monospace",fontSize:11,letterSpacing:3}}>LOADING...</div>;

  return(
    <div>
      {/* Arch stack */}
      <div style={{background:"#0D1117",border:"1px solid #1A2030",borderRadius:4,padding:"14px 16px",marginBottom:20}}>
        <div style={{fontSize:9,color:"#4A5568",letterSpacing:3,marginBottom:10}}>STREAMCORE STACK</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {CTO_ARCH_STACK.map(l=>(
            <div key={l.layer} style={{background:"#060A0E",border:"1px solid #1A2030",borderRadius:3,padding:"6px 9px",flex:"1 1 140px"}}>
              <div style={{fontSize:8,color:"#A855F7",letterSpacing:2,marginBottom:3}}>{l.layer}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                {l.items.map(i=><span key={i} style={{fontSize:8,color:"#4A5568",background:"#1A2030",padding:"1px 4px",borderRadius:2}}>{i}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:20}}>
        {[["8 PHASES","16 Weeks"],["AWS EKS","Production"],["StreamCore","Netflix-Style"],[`${pct}%`,"CTO Ready"]].map(([v,l])=>(
          <div key={v} style={{background:"#0D1117",border:"1px solid #A855F725",borderTop:"3px solid #A855F7",padding:"12px 14px",borderRadius:4}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#A855F7"}}>{v}</div>
            <div style={{fontSize:9,color:"#4A5568",letterSpacing:2,textTransform:"uppercase"}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #1A2030",marginBottom:20}}>
        {[["roadmap","Roadmap"],["tracker","Tracker"]].map(([t,l])=>(
          <button key={t} className="tb" onClick={()=>setMainTab(t)} style={{color:mainTab===t?"#A855F7":"#4A5568",padding:"10px 16px",fontSize:10,letterSpacing:3,textTransform:"uppercase",borderBottom:mainTab===t?"2px solid #A855F7":"2px solid transparent",marginBottom:-1}}>
            {l}{t==="tracker"&&doneP>0&&<span style={{marginLeft:5,background:"#A855F720",color:"#A855F7",fontSize:8,padding:"1px 4px",borderRadius:2}}>{doneP}/{CTO_PHASES.length}</span>}
          </button>
        ))}
      </div>

      {mainTab==="roadmap"&&(
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {CTO_PHASES.map(phase=>{
            const isOn=openPhase===phase.id;
            const st=tracker?.phaseStatus[phase.id]||"not_started";
            const sm=SMETA[st];
            const pProjs=phase.projects.map((_,i)=>({k:`${phase.id}-${i}`,done:tracker?.projects[`${phase.id}-${i}`]||false}));
            const pDone=pProjs.filter(p=>p.done).length;
            const it=getIT(phase.id);
            return(
              <div key={phase.id}>
                <div className={`ph${isOn?" on":""}`} onClick={()=>setOpenPhase(isOn?null:phase.id)}
                  style={{background:"#0D1117",borderRadius:isOn?"4px 4px 0 0":4,padding:"14px 18px",borderLeft:`3px solid ${phase.color}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:7}}>
                    <div style={{display:"flex",alignItems:"center",gap:11}}>
                      <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:phase.color}}>{phase.icon}</span>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:9,color:"#4A5568",letterSpacing:2}}>WK {phase.week}</span>
                          <span style={{fontSize:12,color:"#E8EAF0"}}>{phase.title}</span>
                        </div>
                        <div style={{fontSize:10,color:"#4A5568",marginTop:1}}>{phase.goal}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <span style={{fontSize:9,color:sm.tc}}>{sm.dot}</span>
                      {pDone>0&&<span style={{fontSize:9,color:"#00FFB2"}}>{pDone}/{phase.projects.length}✓</span>}
                      <span style={{color:"#4A5568",fontSize:10}}>{isOn?"▲":"▼"}</span>
                    </div>
                  </div>
                </div>
                {isOn&&(
                  <div style={{background:"#0A0E14",border:"1px solid #1A2030",borderTop:"none",borderRadius:"0 0 4px 4px"}}>
                    <div style={{display:"flex",borderBottom:"1px solid #1A2030",padding:"0 16px"}}>
                      {[["overview","Overview"],["content","📖 Commands & Code"]].map(([t,l])=>(
                        <button key={t} className="itb" onClick={e=>{e.stopPropagation();setIT(phase.id,t);}}
                          style={{color:it===t?phase.color:"#4A5568",padding:"9px 13px",fontSize:9,letterSpacing:2,textTransform:"uppercase",borderBottom:it===t?`2px solid ${phase.color}`:"2px solid transparent",marginBottom:-1,background:"none",border:"none"}}>
                          {l}
                        </button>
                      ))}
                    </div>
                    <div style={{padding:"16px"}}>
                      {it==="overview"&&(
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                          <div>
                            <div style={{fontSize:9,color:"#00FFB2",letterSpacing:3,marginBottom:8}}>WHAT YOU LEARN</div>
                            {phase.skills.map((s,i)=>(
                              <div key={i} style={{display:"flex",gap:7,marginBottom:5,fontSize:11,color:"#A0A8B8",lineHeight:1.45}}>
                                <span style={{color:phase.color,flexShrink:0}}>→</span><span>{s}</span>
                              </div>
                            ))}
                            <div style={{marginTop:12}}>
                              <div style={{fontSize:9,color:"#4A5568",letterSpacing:3,marginBottom:5}}>TOOLS</div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                {phase.tools.map(t=><span key={t} style={{background:"#1A2030",color:"#A0A8B8",fontSize:9,padding:"2px 7px",borderRadius:2}}>{t}</span>)}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style={{fontSize:9,color:"#FF6B35",letterSpacing:3,marginBottom:8}}>DELIVERABLES</div>
                            {phase.projects.map((p,i)=>{
                              const pk=`${phase.id}-${i}`;
                              const done=tracker?.projects[pk]||false;
                              return(
                                <div key={i} style={{background:"#0D1117",border:"1px solid #1A2030",borderLeft:`3px solid ${p.hard?"#FF6B35":"#A855F7"}`,padding:"10px 12px",marginBottom:7,borderRadius:"0 4px 4px 0"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                                    <span onClick={e=>{e.stopPropagation();toggleProj(pk);}} className="chk" style={{fontSize:13,color:done?"#00FFB2":"#2A3040"}}>{done?"☑":"☐"}</span>
                                    <span style={{fontSize:11,color:done?"#4A5568":"#E8EAF0",textDecoration:done?"line-through":"none"}}>{p.name}</span>
                                    {p.hard&&<span style={{background:"#FF6B3520",color:"#FF6B35",fontSize:7,padding:"1px 5px",borderRadius:2}}>HARD</span>}
                                  </div>
                                  <div style={{fontSize:10,color:"#4A5568",lineHeight:1.5}}>{p.desc}</div>
                                </div>
                              );
                            })}
                            <button className="sc" onClick={e=>{e.stopPropagation();cycleStatus(phase.id);}}
                              style={{background:sm.color,color:sm.tc,fontSize:8,padding:"4px 10px",letterSpacing:2,textTransform:"uppercase",border:`1px solid ${sm.tc}30`,marginTop:8}}>
                              {sm.dot} {sm.label}
                            </button>
                          </div>
                        </div>
                      )}
                      {it==="content"&&<ContentRenderer sections={phase.content||[]}/>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {mainTab==="tracker"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:20}}>
            {[{l:"PHASES DONE",v:doneP,t:CTO_PHASES.length,c:"#A855F7"},{l:"PROJECTS",v:doneProj,t:totalProj,c:"#00FFB2"},{l:"CTO READY",v:pct,t:100,c:"#FACC15",unit:"%"}].map(s=>(
              <div key={s.l} style={{background:"#0D1117",border:`1px solid ${s.c}25`,borderTop:`3px solid ${s.c}`,padding:"12px 14px",borderRadius:4}}>
                <div style={{fontSize:8,color:"#4A5568",letterSpacing:3,marginBottom:5}}>{s.l}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:s.c}}>{s.v}<span style={{fontSize:10,color:"#4A5568",fontFamily:"inherit",fontWeight:400}}>{s.unit||` / ${s.t}`}</span></div>
                <div style={{background:"#1A2030",height:3,borderRadius:2,marginTop:6}}><div className="bar" style={{background:s.c,height:"100%",width:`${s.unit?s.v:Math.round((s.v/s.t)*100)}%`,borderRadius:2}}/></div>
              </div>
            ))}
          </div>
          <div style={{background:"#0D1117",border:"1px solid #A855F730",borderRadius:4,padding:"12px 16px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:9,color:"#A855F7",letterSpacing:3}}>CTO PROGRESS</span><span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#A855F7"}}>{pct}%</span></div>
            <div style={{background:"#1A2030",height:6,borderRadius:3}}><div className="bar" style={{background:"linear-gradient(90deg,#A855F7,#00FFB2)",height:"100%",width:`${pct}%`,borderRadius:3}}/></div>
            {tracker?.startDate&&<div style={{fontSize:9,color:"#4A5568",marginTop:6}}>Target: {new Date(new Date(tracker.startDate).getTime()+112*24*60*60*1000).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {CTO_PHASES.map(phase=>{
              const st=tracker?.phaseStatus[phase.id]||"not_started";
              const sm=SMETA[st];
              const wp=phase.projects.map((_,i)=>({k:`${phase.id}-${i}`,done:tracker?.projects[`${phase.id}-${i}`]||false}));
              const pd=wp.filter(p=>p.done).length;
              return(
                <div key={phase.id} style={{background:"#0D1117",border:"1px solid #1A2030",borderRadius:4,padding:"10px 14px",borderLeft:`3px solid ${phase.color}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:13,color:phase.color}}>{phase.icon}</span>
                      <div><div style={{fontSize:11,color:"#E8EAF0"}}>{phase.title}</div><div style={{fontSize:9,color:"#4A5568"}}>Week {phase.week}</div></div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      {wp.map(p=><span key={p.k} onClick={()=>toggleProj(p.k)} className="chk" style={{fontSize:13,color:p.done?"#00FFB2":"#2A3040"}}>{p.done?"☑":"☐"}</span>)}
                      <span style={{fontSize:9,color:"#4A5568"}}>{pd}/{phase.projects.length}</span>
                      <button className="sc" onClick={()=>cycleStatus(phase.id)} style={{background:sm.color,color:sm.tc,fontSize:8,padding:"3px 8px",letterSpacing:2,textTransform:"uppercase",border:`1px solid ${sm.tc}30`}}>{sm.dot} {sm.label}</button>
                    </div>
                  </div>
                  <div style={{marginTop:6,background:"#1A2030",height:2,borderRadius:1}}><div className="bar" style={{background:phase.color,height:"100%",width:`${phase.projects.length?Math.round((pd/phase.projects.length)*100):0}%`,borderRadius:1}}/></div>
                </div>
              );
            })}
          </div>
          <div style={{textAlign:"center",paddingTop:12,marginTop:12,borderTop:"1px solid #1A2030"}}>
            <button onClick={()=>{if(window.confirm("Reset CTO plan progress?"))resetT();}} style={{background:"transparent",color:"#4A5568",border:"1px solid #1A2030",fontSize:9,padding:"7px 14px",letterSpacing:2,cursor:"pointer",borderRadius:3}}>↺ RESET</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App(){
  const [activePlan,setActivePlan]=useState("ai");

  const aiDoneWeeks = (() => {
    try{const d=JSON.parse(localStorage.getItem("ai_plan_v3")||"{}");return Object.values(d.weekStatus||{}).filter(s=>s==="done").length;}catch{return 0;}
  })();
  const ctoDonePhases = (() => {
    try{const d=JSON.parse(localStorage.getItem("cto_plan_v2")||"{}");return Object.values(d.phaseStatus||{}).filter(s=>s==="done").length;}catch{return 0;}
  })();

  return(
    <div style={{background:"#080C10",minHeight:"100vh",color:"#E8EAF0",fontFamily:"'DM Mono','Fira Mono',monospace"}}>
      <style>{GLOBAL_CSS}</style>

      {/* TOP NAV */}
      <div style={{background:"#080C10",borderBottom:"1px solid #1A2030",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"12px 0"}}>
            <span style={{color:"#00FFB2",fontSize:10,letterSpacing:3}}>◈</span>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:"#E8EAF0"}}>DEVOPS → CTO</span>
            <span style={{color:"#1A2030",fontSize:11,margin:"0 4px"}}>/</span>
            <span style={{fontSize:9,color:"#4A5568",letterSpacing:2}}>7-Month Master Plan</span>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button className="ntb" onClick={()=>setActivePlan("ai")} style={{
              background:activePlan==="ai"?"#00FFB215":"transparent",
              color:activePlan==="ai"?"#00FFB2":"#4A5568",
              border:`1px solid ${activePlan==="ai"?"#00FFB240":"#1A2030"}`,
              padding:"8px 14px",fontSize:10,letterSpacing:2,borderRadius:4,textTransform:"uppercase"
            }}>
              <span style={{marginRight:6}}>◈</span>
              AI Infra Plan
              {aiDoneWeeks>0&&<span style={{marginLeft:6,background:"#00FFB220",color:"#00FFB2",fontSize:8,padding:"1px 5px",borderRadius:2}}>{aiDoneWeeks}/12</span>}
            </button>
            <button className="ntb" onClick={()=>setActivePlan("cto")} style={{
              background:activePlan==="cto"?"#A855F715":"transparent",
              color:activePlan==="cto"?"#A855F7":"#4A5568",
              border:`1px solid ${activePlan==="cto"?"#A855F740":"#1A2030"}`,
              padding:"8px 14px",fontSize:10,letterSpacing:2,borderRadius:4,textTransform:"uppercase"
            }}>
              <span style={{marginRight:6}}>◉</span>
              CTO Blueprint
              {ctoDonePhases>0&&<span style={{marginLeft:6,background:"#A855F720",color:"#A855F7",fontSize:8,padding:"1px 5px",borderRadius:2}}>{ctoDonePhases}/8</span>}
            </button>
          </div>
        </div>
      </div>

      {/* PLAN HEADER */}
      <div style={{background:activePlan==="ai"?"linear-gradient(180deg,#0D1A12 0%,#080C10 100%)":"linear-gradient(180deg,#0A0D1A 0%,#080C10 100%)",borderBottom:`1px solid ${activePlan==="ai"?"#00FFB240":"#A855F740"}`,padding:"32px 20px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:"35%",height:"100%",background:`radial-gradient(ellipse at top right,${activePlan==="ai"?"#00FFB215":"#A855F715"} 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{fontSize:9,color:activePlan==="ai"?"#00FFB2":"#A855F7",letterSpacing:4,textTransform:"uppercase",marginBottom:8}}>
            {activePlan==="ai"?"◈ PHASE 1 OF 2 · 12 WEEKS · AI INFRASTRUCTURE":"◉ PHASE 2 OF 2 · 16 WEEKS · CTO BLUEPRINT"}
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(22px,4vw,42px)",fontWeight:800,color:"#FFF",letterSpacing:-1,marginBottom:6}}>
            {activePlan==="ai"?"SURVIVE THE NEXT 10 YEARS":"BUILD STREAMCORE"}
          </h1>
          <p style={{color:activePlan==="ai"?"#00FFB2":"#A855F7",fontSize:12,letterSpacing:1}}>
            {activePlan==="ai"?"DevOps → AI Infrastructure Engineer · All learning materials embedded":"Netflix-scale platform on AWS · Every command embedded · Zero Googling"}
          </p>
          <p style={{color:"#4A5568",fontSize:10,marginTop:6}}>
            {activePlan==="ai"?"Months 1–3":"Months 4–7"} · {activePlan==="ai"?"Follow with the CTO Blueprint →":"Follows the AI Infra Plan"}
          </p>
        </div>
      </div>

      {/* PLAN CONTENT */}
      <div style={{maxWidth:1000,margin:"0 auto",padding:"24px 20px"}}>
        {activePlan==="ai"?<AIPlan/>:<CTOPlan/>}
      </div>

      {/* FOOTER */}
      <div style={{borderTop:"1px solid #1A2030",padding:"14px 20px",marginTop:20}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap"}}>
          {(activePlan==="ai"?
            ["Wk1-4: Foundation","Wk5-6: AI Agents","Wk7-8: Complex Arch","Wk9-10: GPU Infra","Wk11-12: Capstone"]:
            ["Wk1-2: AWS+EKS","Wk3-4: Microservices","Wk5-6: Data Layer","Wk7-8: Service Mesh","Wk9-10: Observability","Wk11-12: Security","Wk13-16: Scale+Capstone"]
          ).map((s,i)=>(
            <div key={i} style={{fontSize:9,color:"#4A5568",letterSpacing:1}}>
              <span style={{color:activePlan==="ai"?"#00FFB2":"#A855F7",marginRight:4}}>{activePlan==="ai"?"◈":"◉"}</span>{s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
