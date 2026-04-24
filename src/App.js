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
// CTO PROJECT — STREAMCORE PRODUCTION DEPLOYMENT
// ═══════════════════════════════════════════════════════════════════════════════

// All code blocks stored as arrays to avoid template literal conflicts with
// shell variables like DOLLAR{VAR}, DOLLAR((expr)), and heredoc syntax.

const CTO_STEPS = [
  // ─── PHASE 1: FOUNDATION ─────────────────────────────────────────────────
  {
    phase: "FOUNDATION",
    phaseColor: "#00FFB2",
    id: "1.1",
    title: "Bootstrap AWS + Terraform Remote State",
    why: "Every production environment starts with a remote state backend. Without it, two engineers running terraform apply simultaneously will corrupt your state file and create duplicate or conflicting resources. S3 + DynamoDB gives you atomic locking and versioned state history — your single source of truth for what exists in AWS.",
    commands: [
      "# One-time bootstrap — run this before anything else",
      "aws configure  # set your AWS credentials",
      "",
      "# Create S3 bucket for Terraform state",
      'aws s3 mb s3://streamcore-tfstate-$(aws sts get-caller-identity --query Account --output text) --region us-east-1',
      'aws s3api put-bucket-versioning --bucket streamcore-tfstate-ACCOUNT_ID \\',
      '  --versioning-configuration Status=Enabled',
      'aws s3api put-bucket-encryption --bucket streamcore-tfstate-ACCOUNT_ID \\',
      '  --server-side-encryption-configuration \'{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}\'',
      "",
      "# DynamoDB table for state locking",
      'aws dynamodb create-table \\',
      '  --table-name streamcore-tflock \\',
      '  --attribute-definitions AttributeName=LockID,AttributeType=S \\',
      '  --key-schema AttributeName=LockID,KeyType=HASH \\',
      '  --billing-mode PAY_PER_REQUEST \\',
      '  --region us-east-1',
      "",
      "# Verify",
      "aws s3 ls | grep streamcore",
      "aws dynamodb describe-table --table-name streamcore-tflock --query 'Table.TableStatus'",
    ],
    expect: "S3 bucket created with versioning enabled. DynamoDB table status: ACTIVE.",
    tools: ["AWS CLI", "S3", "DynamoDB"],
  },
  {
    phase: "FOUNDATION",
    phaseColor: "#00FFB2",
    id: "1.2",
    title: "VPC + Management Cluster (EKS)",
    why: "Two clusters, one VPC. The management cluster runs ArgoCD, Istio control plane, and monitoring. The workload cluster runs your actual application. This separation means a bad deployment can never take down your deployment tooling. The management cluster runs 2x t3.medium nodes — cheap, since it only runs platform tooling, not user traffic.",
    commands: [
      "# Clone the infra repo",
      "mkdir streamcore && cd streamcore",
      "git init && mkdir -p infra/{vpc,eks-mgmt,eks-workload,rds,redis,rabbitmq}",
      "",
      "# infra/vpc/main.tf",
      'cat > infra/vpc/main.tf << \'TFEOF\'',
      'terraform {',
      '  required_version = ">= 1.6"',
      '  backend "s3" {',
      '    bucket         = "streamcore-tfstate-ACCOUNT_ID"',
      '    key            = "vpc/terraform.tfstate"',
      '    region         = "us-east-1"',
      '    dynamodb_table = "streamcore-tflock"',
      '    encrypt        = true',
      '  }',
      '}',
      '',
      'module "vpc" {',
      '  source  = "terraform-aws-modules/vpc/aws"',
      '  version = "~> 5.0"',
      '  name = "streamcore-vpc"',
      '  cidr = "10.0.0.0/16"',
      '  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]',
      '  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]',
      '  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]',
      '  enable_nat_gateway   = true',
      '  single_nat_gateway   = true   # cost saving — 1 NAT for both clusters',
      '  enable_dns_hostnames = true',
      '  private_subnet_tags = {',
      '    "kubernetes.io/role/internal-elb" = 1',
      '    "karpenter.sh/discovery"          = "streamcore"',
      '  }',
      '  public_subnet_tags = {',
      '    "kubernetes.io/role/elb" = 1',
      '  }',
      '}',
      '',
      'output "vpc_id"             { value = module.vpc.vpc_id }',
      'output "private_subnet_ids" { value = module.vpc.private_subnets }',
      'output "public_subnet_ids"  { value = module.vpc.public_subnets }',
      'TFEOF',
      "",
      "cd infra/vpc && terraform init && terraform apply -auto-approve",
    ],
    expect: "VPC created with 3 private + 3 public subnets across 3 AZs. One NAT gateway.",
    tools: ["Terraform", "AWS VPC"],
  },
  {
    phase: "FOUNDATION",
    phaseColor: "#00FFB2",
    id: "1.3",
    title: "Management EKS Cluster (Platform Tools)",
    why: "This cluster hosts only ArgoCD, Istio control plane, and Grafana. Running it on 2x t3.medium nodes keeps cost under $60/month for the management plane. IRSA (IAM Roles for Service Accounts) is set here so pods get AWS permissions without any static credentials stored anywhere in the cluster.",
    commands: [
      "# infra/eks-mgmt/main.tf",
      'cat > infra/eks-mgmt/main.tf << \'TFEOF\'',
      'terraform {',
      '  backend "s3" {',
      '    bucket         = "streamcore-tfstate-ACCOUNT_ID"',
      '    key            = "eks-mgmt/terraform.tfstate"',
      '    region         = "us-east-1"',
      '    dynamodb_table = "streamcore-tflock"',
      '  }',
      '}',
      '',
      'data "terraform_remote_state" "vpc" {',
      '  backend = "s3"',
      '  config = {',
      '    bucket = "streamcore-tfstate-ACCOUNT_ID"',
      '    key    = "vpc/terraform.tfstate"',
      '    region = "us-east-1"',
      '  }',
      '}',
      '',
      'module "eks_mgmt" {',
      '  source  = "terraform-aws-modules/eks/aws"',
      '  version = "~> 20.0"',
      '  cluster_name    = "streamcore-mgmt"',
      '  cluster_version = "1.29"',
      '  vpc_id          = data.terraform_remote_state.vpc.outputs.vpc_id',
      '  subnet_ids      = data.terraform_remote_state.vpc.outputs.private_subnet_ids',
      '  enable_irsa     = true',
      '  cluster_endpoint_public_access = true',
      '  eks_managed_node_groups = {',
      '    platform = {',
      '      instance_types = ["t3.medium"]',
      '      min_size       = 2',
      '      max_size       = 4',
      '      desired_size   = 2',
      '    }',
      '  }',
      '  cluster_addons = {',
      '    coredns    = { most_recent = true }',
      '    kube-proxy = { most_recent = true }',
      '    vpc-cni    = { most_recent = true }',
      '    aws-ebs-csi-driver = { most_recent = true }',
      '  }',
      '}',
      'TFEOF',
      "",
      "cd infra/eks-mgmt && terraform init && terraform apply -auto-approve",
      "",
      "# Configure kubectl for management cluster",
      "aws eks update-kubeconfig --name streamcore-mgmt --region us-east-1 --alias mgmt",
      "kubectl config use-context mgmt",
      "kubectl get nodes  # should show 2 t3.medium nodes",
    ],
    expect: "2 t3.medium nodes in Ready state. kubectl config shows 'mgmt' context.",
    tools: ["Terraform", "EKS", "kubectl"],
  },
  {
    phase: "FOUNDATION",
    phaseColor: "#00FFB2",
    id: "1.4",
    title: "Workload EKS Cluster (Application Traffic)",
    why: "The workload cluster runs actual user-facing services. It uses Karpenter instead of managed node groups so nodes provision and terminate based on actual pod demand — no over-provisioning. Spot instances handle burst traffic at 70% discount. On-demand instances handle the baseline minimum. This is the FinOps-first cluster design.",
    commands: [
      "# infra/eks-workload/main.tf",
      'cat > infra/eks-workload/main.tf << \'TFEOF\'',
      'module "eks_workload" {',
      '  source  = "terraform-aws-modules/eks/aws"',
      '  version = "~> 20.0"',
      '  cluster_name    = "streamcore-workload"',
      '  cluster_version = "1.29"',
      '  vpc_id          = data.terraform_remote_state.vpc.outputs.vpc_id',
      '  subnet_ids      = data.terraform_remote_state.vpc.outputs.private_subnet_ids',
      '  enable_irsa     = true',
      '  cluster_endpoint_public_access = true',
      '  # Minimal static node group — Karpenter handles the rest',
      '  eks_managed_node_groups = {',
      '    system = {',
      '      instance_types = ["t3.medium"]',
      '      min_size       = 2',
      '      max_size       = 2',
      '      desired_size   = 2',
      '      labels         = { role = "system" }',
      '    }',
      '  }',
      '  # Tags required for Karpenter node discovery',
      '  tags = {',
      '    "karpenter.sh/discovery" = "streamcore-workload"',
      '  }',
      '}',
      'TFEOF',
      "",
      "cd infra/eks-workload && terraform init && terraform apply -auto-approve",
      "aws eks update-kubeconfig --name streamcore-workload --region us-east-1 --alias workload",
      "",
      "# Verify both contexts",
      "kubectl config get-contexts",
      "kubectl --context=mgmt get nodes",
      "kubectl --context=workload get nodes",
    ],
    expect: "Two kubectl contexts: mgmt and workload. Each shows 2 t3.medium nodes Ready.",
    tools: ["Terraform", "EKS", "Karpenter"],
  },

  // ─── PHASE 2: GITOPS WITH ARGOCD ─────────────────────────────────────────
  {
    phase: "GITOPS",
    phaseColor: "#A855F7",
    id: "2.1",
    title: "Install ArgoCD on Management Cluster",
    why: "ArgoCD lives on the management cluster and deploys to the workload cluster. This is the GitOps topology: one control plane watching Git, pushing to many clusters. Every change to your application goes through Git — no human ever runs kubectl apply on the workload cluster directly. Your Git history becomes your deployment audit log.",
    commands: [
      "kubectl config use-context mgmt",
      "",
      "# Install ArgoCD",
      "kubectl create namespace argocd",
      "kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml",
      "kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s",
      "",
      "# Expose ArgoCD UI via LoadBalancer",
      'kubectl patch svc argocd-server -n argocd -p \'{"spec": {"type": "LoadBalancer"}}\'',
      "",
      "# Get admin password",
      "kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d",
      "",
      "# Get UI URL",
      "kubectl get svc argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'",
      "",
      "# Login via CLI",
      "ARGOCD_URL=$(kubectl get svc argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')",
      "argocd login \${ARGOCD_URL} --username admin --password PASTE_PASSWORD --insecure",
      "",
      "# Register the workload cluster",
      "argocd cluster add workload --name streamcore-workload",
      "argocd cluster list  # should show both in-cluster and streamcore-workload",
    ],
    expect: "ArgoCD UI accessible. Two clusters registered: in-cluster (mgmt) and streamcore-workload.",
    tools: ["ArgoCD", "kubectl"],
  },
  {
    phase: "GITOPS",
    phaseColor: "#A855F7",
    id: "2.2",
    title: "App of Apps GitOps Structure",
    why: "App of Apps is the standard ArgoCD pattern at scale. One root Application points to a folder of Application manifests. When you push a new Application YAML to Git, ArgoCD automatically picks it up and starts syncing. You never manually register apps in ArgoCD — Git is always the source of intent.",
    commands: [
      "# Create your GitOps repo structure",
      "mkdir -p gitops/{apps,platform,workloads/{user-service,content-service,rabbitmq,redis}}",
      "",
      "# Root application (gitops/root-app.yaml)",
      'cat > gitops/root-app.yaml << \'EOF\'',
      'apiVersion: argoproj.io/v1alpha1',
      'kind: Application',
      'metadata:',
      '  name: root',
      '  namespace: argocd',
      '  finalizers: [resources-finalizer.argocd.argoproj.io]',
      'spec:',
      '  project: default',
      '  source:',
      '    repoURL: https://github.com/YOUR_ORG/streamcore-gitops',
      '    targetRevision: main',
      '    path: apps',
      '  destination:',
      '    server: https://kubernetes.default.svc',
      '    namespace: argocd',
      '  syncPolicy:',
      '    automated:',
      '      prune: true',
      '      selfHeal: true',
      'EOF',
      "",
      "# Each file in gitops/apps/ is a child Application",
      "# Example: gitops/apps/rabbitmq.yaml",
      'cat > gitops/apps/rabbitmq.yaml << \'EOF\'',
      'apiVersion: argoproj.io/v1alpha1',
      'kind: Application',
      'metadata:',
      '  name: rabbitmq',
      '  namespace: argocd',
      'spec:',
      '  project: default',
      '  source:',
      '    repoURL: https://github.com/YOUR_ORG/streamcore-gitops',
      '    targetRevision: main',
      '    path: workloads/rabbitmq',
      '  destination:',
      '    server: https://streamcore-workload-api-endpoint.region.eks.amazonaws.com',
      '    namespace: messaging',
      '  syncPolicy:',
      '    automated:',
      '      prune: true',
      '      selfHeal: true',
      '    syncOptions: [CreateNamespace=true]',
      'EOF',
      "",
      "# Push to GitHub and apply root app",
      "git add . && git commit -m 'init gitops structure' && git push",
      "kubectl apply -f gitops/root-app.yaml",
      "argocd app list  # root app appears, discovers child apps automatically",
    ],
    expect: "Root app synced. Child apps auto-discovered. ArgoCD dashboard shows all apps.",
    tools: ["ArgoCD", "Git", "GitHub"],
  },

  // ─── PHASE 3: KARPENTER FINOPS ───────────────────────────────────────────
  {
    phase: "FINOPS",
    phaseColor: "#FACC15",
    id: "3.1",
    title: "Karpenter — On-Demand + Spot NodePools",
    why: "Karpenter replaces Cluster Autoscaler. It provisions nodes in 30 seconds vs 3 minutes and terminates them immediately when no longer needed. Two NodePools: on-demand for stateful/critical workloads (RabbitMQ consumers, the web tier), spot for stateless burst traffic (API servers, background jobs). You save 60-70% on EC2 costs. Karpenter also auto-selects the cheapest available instance type across families.",
    commands: [
      "kubectl config use-context workload",
      "",
      "# Install Karpenter via Helm (on workload cluster)",
      "helm repo add karpenter https://charts.karpenter.sh/",
      "helm install karpenter oci://public.ecr.aws/karpenter/karpenter \\",
      "  --version 0.37.0 \\",
      "  --namespace kube-system \\",
      "  --set settings.clusterName=streamcore-workload \\",
      "  --set settings.interruptionQueue=streamcore-workload \\",
      "  --set controller.resources.requests.cpu=250m \\",
      "  --set controller.resources.requests.memory=256Mi",
      "",
      "# On-demand NodePool — stable workloads",
      'cat > gitops/platform/nodepool-ondemand.yaml << \'EOF\'',
      'apiVersion: karpenter.sh/v1beta1',
      'kind: NodePool',
      'metadata:',
      '  name: on-demand',
      'spec:',
      '  template:',
      '    metadata:',
      '      labels:',
      '        billing/team: platform',
      '        karpenter.sh/capacity-type: on-demand',
      '    spec:',
      '      nodeClassRef:',
      '        name: streamcore',
      '      requirements:',
      '        - key: karpenter.sh/capacity-type',
      '          operator: In',
      '          values: ["on-demand"]',
      '        - key: karpenter.k8s.aws/instance-family',
      '          operator: In',
      '          values: ["t3", "t3a", "m5", "m5a"]',
      '        - key: karpenter.k8s.aws/instance-size',
      '          operator: NotIn',
      '          values: ["nano", "micro"]',
      '      taints: []',
      '  limits:',
      '    cpu: "20"',
      '    memory: 40Gi',
      '  disruption:',
      '    consolidationPolicy: WhenUnderutilized',
      '    consolidateAfter: 30s',
      '---',
      'apiVersion: karpenter.sh/v1beta1',
      'kind: NodePool',
      'metadata:',
      '  name: spot',
      'spec:',
      '  template:',
      '    metadata:',
      '      labels:',
      '        billing/team: app',
      '        karpenter.sh/capacity-type: spot',
      '    spec:',
      '      nodeClassRef:',
      '        name: streamcore',
      '      requirements:',
      '        - key: karpenter.sh/capacity-type',
      '          operator: In',
      '          values: ["spot"]',
      '        - key: karpenter.k8s.aws/instance-family',
      '          operator: In',
      '          values: ["t3", "t3a", "m5", "m5a", "m4"]',
      '      taints:',
      '        - key: spot',
      '          effect: NoSchedule',
      '  limits:',
      '    cpu: "40"',
      '  disruption:',
      '    consolidationPolicy: WhenEmpty',
      '    consolidateAfter: 60s',
      'EOF',
      "",
      "kubectl apply -f gitops/platform/nodepool-ondemand.yaml",
    ],
    expect: "Two NodePools registered. Karpenter pod running. Nodes provision when pods are scheduled.",
    tools: ["Karpenter", "Helm", "kubectl"],
  },
  {
    phase: "FINOPS",
    phaseColor: "#FACC15",
    id: "3.2",
    title: "Cost Tagging Strategy + AWS Budget Alerts",
    why: "Tagging is the foundation of FinOps. Without tags you have one AWS bill. With tags you have per-team, per-service cost attribution. Set this up before deploying anything or you'll spend weeks retroactively tagging. Budget alerts fire before you exceed limits — not after. $300 is roughly the cost of running this stack, so alert at $250 to give yourself time to react.",
    commands: [
      "# Enforce tags on all resources via AWS Config",
      '# infra/finops/main.tf',
      'cat > infra/finops/main.tf << \'TFEOF\'',
      '# AWS Budget: alert at 80% of $300/month',
      'resource "aws_budgets_budget" "streamcore" {',
      '  name         = "streamcore-monthly"',
      '  budget_type  = "COST"',
      '  limit_amount = "300"',
      '  limit_unit   = "USD"',
      '  time_unit    = "MONTHLY"',
      '',
      '  notification {',
      '    comparison_operator        = "GREATER_THAN"',
      '    threshold                  = 80',
      '    threshold_type             = "PERCENTAGE"',
      '    notification_type          = "ACTUAL"',
      '    subscriber_email_addresses = ["your@email.com"]',
      '  }',
      '  notification {',
      '    comparison_operator        = "GREATER_THAN"',
      '    threshold                  = 100',
      '    threshold_type             = "PERCENTAGE"',
      '    notification_type          = "FORECASTED"',
      '    subscriber_email_addresses = ["your@email.com"]',
      '  }',
      '}',
      '',
      '# Cost Allocation Tags',
      'resource "aws_ce_cost_allocation_tag" "project" {',
      '  tag_key = "Project"',
      '  status  = "Active"',
      '}',
      'resource "aws_ce_cost_allocation_tag" "team" {',
      '  tag_key = "Team"',
      '  status  = "Active"',
      '}',
      'resource "aws_ce_cost_allocation_tag" "env" {',
      '  tag_key = "Environment"',
      '  status  = "Active"',
      '}',
      'TFEOF',
      "",
      "# Tag all k8s nodes with team via Karpenter labels",
      "# (done above in NodePool metadata.labels)",
      "",
      "# View current spend breakdown",
      "aws ce get-cost-and-usage \\",
      "  --time-period Start=2024-01-01,End=2024-01-31 \\",
      "  --granularity MONTHLY \\",
      "  --metrics BlendedCost \\",
      "  --group-by Type=TAG,Key=Project",
    ],
    expect: "Budget alerts configured. Cost allocation tags active. Monthly spend visible per Project/Team.",
    tools: ["AWS Budgets", "Cost Explorer", "Terraform"],
  },

  // ─── PHASE 4: ISTIO SERVICE MESH ─────────────────────────────────────────
  {
    phase: "SERVICE MESH",
    phaseColor: "#FF6B35",
    id: "4.1",
    title: "Install Istio on Both Clusters (Multi-Primary)",
    why: "Multi-primary Istio means both clusters run their own Istio control plane (istiod) but share service discovery. A service in the workload cluster can call a service in the management cluster and Istio handles the routing, load balancing, and mTLS transparently. This is more resilient than a single control plane — if the management cluster has issues, the workload cluster keeps serving traffic.",
    commands: [
      "curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.21.0 sh -",
      "export PATH=\${PWD}/istio-1.21.0/bin:\${PATH}",
      "",
      "# Install on MANAGEMENT cluster",
      "kubectl config use-context mgmt",
      'istioctl install -y -f - << \'EOF\'',
      'apiVersion: install.istio.io/v1alpha1',
      'kind: IstioOperator',
      'spec:',
      '  values:',
      '    global:',
      '      meshID: streamcore-mesh',
      '      multiCluster:',
      '        clusterName: streamcore-mgmt',
      '      network: network1',
      '  components:',
      '    ingressGateways:',
      '      - name: istio-ingressgateway',
      '        enabled: true',
      '        k8s:',
      '          service:',
      '            type: LoadBalancer',
      'EOF',
      "",
      "# Install on WORKLOAD cluster",
      "kubectl config use-context workload",
      'istioctl install -y -f - << \'EOF\'',
      'apiVersion: install.istio.io/v1alpha1',
      'kind: IstioOperator',
      'spec:',
      '  values:',
      '    global:',
      '      meshID: streamcore-mesh',
      '      multiCluster:',
      '        clusterName: streamcore-workload',
      '      network: network1',
      'EOF',
      "",
      "# Enable sidecar injection on app namespaces",
      "for ns in user-service content-service messaging caching; do",
      "  kubectl --context=workload create namespace \${ns} --dry-run=client -o yaml | kubectl apply -f -",
      "  kubectl --context=workload label namespace \${ns} istio-injection=enabled",
      "done",
    ],
    expect: "istiod running on both clusters. Namespaces labelled for injection. Ingress gateway has external IP.",
    tools: ["Istio", "istioctl"],
  },
  {
    phase: "SERVICE MESH",
    phaseColor: "#FF6B35",
    id: "4.2",
    title: "Enforce STRICT mTLS + Traffic Policies",
    why: "STRICT mTLS means every pod-to-pod call is encrypted and mutually authenticated — no service can call another without a valid Istio-issued certificate. This replaces network-level security (VPN, security groups between pods) with identity-based security. Circuit breakers prevent a slow downstream service from cascading failures upstream. A 500ms timeout with 3 retries is the correct baseline for an API-serving microservice.",
    commands: [
      "kubectl config use-context workload",
      "",
      "# Enforce STRICT mTLS cluster-wide",
      'kubectl apply -f - << \'EOF\'',
      'apiVersion: security.istio.io/v1beta1',
      'kind: PeerAuthentication',
      'metadata:',
      '  name: default',
      '  namespace: istio-system',
      'spec:',
      '  mtls:',
      '    mode: STRICT',
      'EOF',
      "",
      "# Default traffic policy for all services",
      '# gitops/platform/istio-defaults.yaml',
      'cat > gitops/platform/istio-defaults.yaml << \'EOF\'',
      'apiVersion: networking.istio.io/v1alpha3',
      'kind: DestinationRule',
      'metadata:',
      '  name: default-circuit-breaker',
      '  namespace: istio-system',
      'spec:',
      '  host: "*.svc.cluster.local"',
      '  trafficPolicy:',
      '    connectionPool:',
      '      tcp:',
      '        maxConnections: 100',
      '      http:',
      '        http1MaxPendingRequests: 50',
      '        http2MaxRequests: 500',
      '    outlierDetection:',
      '      consecutive5xxErrors: 5',
      '      interval: 30s',
      '      baseEjectionTime: 30s',
      '      maxEjectionPercent: 50',
      '---',
      'apiVersion: networking.istio.io/v1alpha3',
      'kind: VirtualService',
      'metadata:',
      '  name: default-retry-policy',
      '  namespace: istio-system',
      'spec:',
      '  hosts: ["*"]',
      '  http:',
      '    - timeout: 10s',
      '      retries:',
      '        attempts: 3',
      '        perTryTimeout: 3s',
      '        retryOn: 5xx,gateway-error,reset,connect-failure',
      'EOF',
      "",
      "kubectl apply -f gitops/platform/istio-defaults.yaml",
      "",
      "# Verify mTLS is enforced",
      "istioctl x check-inject -n user-service",
      "kubectl get peerauthentication --all-namespaces",
    ],
    expect: "PeerAuthentication STRICT mode active. Circuit breaker rules applied globally. All namespaces show mtls=strict.",
    tools: ["Istio", "kubectl"],
  },

  // ─── PHASE 5: DATA LAYER ─────────────────────────────────────────────────
  {
    phase: "DATA LAYER",
    phaseColor: "#38BDF8",
    id: "5.1",
    title: "RDS MySQL — Free Tier (db.t3.micro)",
    why: "db.t3.micro with 20GB gp2 storage qualifies for AWS Free Tier (750 hours/month free for 12 months). This is enough for development and light production. Single-AZ because the free tier doesn't cover Multi-AZ standby — acceptable for dev, but document this as a known risk. The security group only allows connections from the private subnet CIDR, so RDS is never directly reachable from the internet.",
    commands: [
      "# infra/rds/main.tf",
      'cat > infra/rds/main.tf << \'TFEOF\'',
      'data "terraform_remote_state" "vpc" {',
      '  backend = "s3"',
      '  config = {',
      '    bucket = "streamcore-tfstate-ACCOUNT_ID"',
      '    key    = "vpc/terraform.tfstate"',
      '    region = "us-east-1"',
      '  }',
      '}',
      '',
      'resource "aws_security_group" "rds" {',
      '  name   = "streamcore-rds"',
      '  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id',
      '  ingress {',
      '    from_port   = 3306',
      '    to_port     = 3306',
      '    protocol    = "tcp"',
      '    cidr_blocks = ["10.0.0.0/16"]  # VPC CIDR only',
      '  }',
      '}',
      '',
      'resource "aws_db_subnet_group" "main" {',
      '  name       = "streamcore"',
      '  subnet_ids = data.terraform_remote_state.vpc.outputs.private_subnet_ids',
      '}',
      '',
      'resource "aws_db_instance" "main" {',
      '  identifier        = "streamcore-mysql"',
      '  engine            = "mysql"',
      '  engine_version    = "8.0"',
      '  instance_class    = "db.t3.micro"  # FREE TIER',
      '  allocated_storage = 20             # FREE TIER max',
      '  storage_type      = "gp2"',
      '  db_name           = "streamcore"',
      '  username          = "admin"',
      '  password          = var.db_password',
      '  port              = 3306',
      '  multi_az                = false  # free tier: no multi-AZ',
      '  publicly_accessible     = false',
      '  skip_final_snapshot     = true',
      '  backup_retention_period = 3',
      '  deletion_protection     = false',
      '  db_subnet_group_name    = aws_db_subnet_group.main.name',
      '  vpc_security_group_ids  = [aws_security_group.rds.id]',
      '  tags = {',
      '    Project     = "streamcore"',
      '    Environment = "dev"',
      '    CostNote    = "free-tier-eligible"',
      '  }',
      '}',
      '',
      'output "rds_endpoint" { value = aws_db_instance.main.address }',
      'TFEOF',
      "",
      "cd infra/rds && terraform init",
      "terraform apply -var='db_password=SecurePass123!' -auto-approve",
      "",
      "# Store RDS credentials in AWS Secrets Manager",
      "aws secretsmanager create-secret \\",
      "  --name streamcore/rds/credentials \\",
      '  --secret-string \'{"username":"admin","password":"SecurePass123!","host":"PASTE_RDS_ENDPOINT","port":"3306","database":"streamcore"}\'',
    ],
    expect: "RDS MySQL db.t3.micro running. Endpoint stored in Secrets Manager. Not publicly accessible.",
    tools: ["AWS RDS", "Terraform", "Secrets Manager"],
  },
  {
    phase: "DATA LAYER",
    phaseColor: "#38BDF8",
    id: "5.2",
    title: "ElastiCache Redis — Query Caching (cache.t3.micro)",
    why: "Query caching eliminates repeated database hits for read-heavy data. User profiles, product listings, session data — once fetched and cached, subsequent requests are served in <1ms from Redis vs 10-50ms from RDS. cache.t3.micro is free tier eligible. The caching strategy is cache-aside: application checks Redis first, falls back to RDS on cache miss, then populates Redis for next time. TTL of 5 minutes balances freshness vs performance.",
    commands: [
      "# infra/redis/main.tf",
      'cat > infra/redis/main.tf << \'TFEOF\'',
      'resource "aws_security_group" "redis" {',
      '  name   = "streamcore-redis"',
      '  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id',
      '  ingress {',
      '    from_port   = 6379',
      '    to_port     = 6379',
      '    protocol    = "tcp"',
      '    cidr_blocks = ["10.0.0.0/16"]',
      '  }',
      '}',
      '',
      'resource "aws_elasticache_subnet_group" "main" {',
      '  name       = "streamcore"',
      '  subnet_ids = data.terraform_remote_state.vpc.outputs.private_subnet_ids',
      '}',
      '',
      'resource "aws_elasticache_cluster" "main" {',
      '  cluster_id           = "streamcore-redis"',
      '  engine               = "redis"',
      '  node_type            = "cache.t3.micro"  # FREE TIER eligible',
      '  num_cache_nodes      = 1',
      '  parameter_group_name = "default.redis7"',
      '  engine_version       = "7.1"',
      '  port                 = 6379',
      '  subnet_group_name    = aws_elasticache_subnet_group.main.name',
      '  security_group_ids   = [aws_security_group.redis.id]',
      '  tags = {',
      '    Project = "streamcore"',
      '    Purpose = "query-cache"',
      '  }',
      '}',
      'output "redis_endpoint" { value = aws_elasticache_cluster.main.cache_nodes[0].address }',
      'TFEOF',
      "",
      "cd infra/redis && terraform init && terraform apply -auto-approve",
      "",
      "# Cache-aside pattern in your Node.js service:",
      '# const cached = await redis.get("user:" + userId);',
      '# if (cached) return JSON.parse(cached);',
      '# const user = await db.query("SELECT * FROM users WHERE id = ?", [userId]);',
      '# await redis.setex("user:" + userId, 300, JSON.stringify(user));  // 5 min TTL',
      '# return user;',
    ],
    expect: "Redis cache.t3.micro running. Endpoint reachable from k8s pods in VPC. Cache-aside pattern implemented.",
    tools: ["ElastiCache", "Redis", "Terraform"],
  },
  {
    phase: "DATA LAYER",
    phaseColor: "#38BDF8",
    id: "5.3",
    title: "RabbitMQ on Kubernetes (Self-Hosted)",
    why: "RabbitMQ on k8s instead of Amazon MQ saves ~$80/month. The RabbitMQ Cluster Operator manages the lifecycle, rolling upgrades, and pod disruption handling. We use it for async operations: order processing, email notifications, inventory updates — anything that doesn't need an immediate response. Three replicas with quorum queues means messages survive a single node failure. Istio mTLS protects all RabbitMQ traffic without changing any app code.",
    commands: [
      "kubectl config use-context workload",
      "",
      "# Install RabbitMQ Cluster Operator",
      "kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml",
      "kubectl wait --for=condition=available deployment/rabbitmq-cluster-operator \\",
      "  -n rabbitmq-system --timeout=120s",
      "",
      "# gitops/workloads/rabbitmq/cluster.yaml",
      'cat > gitops/workloads/rabbitmq/cluster.yaml << \'EOF\'',
      'apiVersion: rabbitmq.com/v1beta1',
      'kind: RabbitmqCluster',
      'metadata:',
      '  name: streamcore',
      '  namespace: messaging',
      'spec:',
      '  replicas: 3',
      '  image: rabbitmq:3.13-management',
      '  resources:',
      '    requests:',
      '      cpu: 200m',
      '      memory: 512Mi',
      '    limits:',
      '      cpu: 1000m',
      '      memory: 1Gi',
      '  rabbitmq:',
      '    additionalConfig: |',
      '      cluster_partition_handling = pause_minority',
      '      vm_memory_high_watermark_paging_ratio = 0.99',
      '      disk_free_limit.relative = 1.0',
      '  persistence:',
      '    storageClassName: gp2',
      '    storage: 10Gi',
      '  service:',
      '    type: ClusterIP',
      'EOF',
      "",
      "# Push to git, ArgoCD deploys automatically",
      "git add gitops/workloads/rabbitmq/ && git commit -m 'add rabbitmq cluster' && git push",
      "",
      "# Verify after ArgoCD syncs (2-3 mins)",
      "kubectl get rabbitmqcluster -n messaging",
      "kubectl get pods -n messaging",
      "",
      "# Get default credentials",
      "kubectl get secret streamcore-default-user -n messaging \\",
      "  -o jsonpath='{.data.username}' | base64 -d",
      "kubectl get secret streamcore-default-user -n messaging \\",
      "  -o jsonpath='{.data.password}' | base64 -d",
      "",
      "# Port forward management UI",
      "kubectl port-forward svc/streamcore -n messaging 15672:15672",
      "# Open http://localhost:15672",
    ],
    expect: "3-replica RabbitMQ cluster running with persistent storage. Management UI accessible. All pods Ready.",
    tools: ["RabbitMQ Operator", "kubectl", "ArgoCD"],
  },

  // ─── PHASE 6: SERVICES DEPLOYMENT ────────────────────────────────────────
  {
    phase: "SERVICES",
    phaseColor: "#00FFB2",
    id: "6.1",
    title: "Deploy Microservices via ArgoCD",
    why: "Every service deployment is a Git commit. The Deployment YAML references a specific image tag — not 'latest'. When GitHub Actions builds a new image and pushes to ECR, it updates the image tag in the GitOps repo via a commit. ArgoCD detects the change and rolls out the new version. This means your deployment history is your Git log and rollback is git revert.",
    commands: [
      "# Example: User Service deployment in GitOps repo",
      '# gitops/workloads/user-service/deployment.yaml',
      'cat > gitops/workloads/user-service/deployment.yaml << \'EOF\'',
      'apiVersion: apps/v1',
      'kind: Deployment',
      'metadata:',
      '  name: user-service',
      '  namespace: user-service',
      '  labels:',
      '    app: user-service',
      '    version: v1',
      '    billing/team: backend',
      '    billing/service: user',
      'spec:',
      '  replicas: 2',
      '  selector:',
      '    matchLabels:',
      '      app: user-service',
      '  strategy:',
      '    type: RollingUpdate',
      '    rollingUpdate:',
      '      maxUnavailable: 0',
      '      maxSurge: 1',
      '  template:',
      '    metadata:',
      '      labels:',
      '        app: user-service',
      '        version: v1',
      '      annotations:',
      '        prometheus.io/scrape: "true"',
      '        prometheus.io/port: "3000"',
      '    spec:',
      '      serviceAccountName: user-service',
      '      containers:',
      '        - name: user-service',
      '          image: ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/streamcore/user-service:SHA_HERE',
      '          ports:',
      '            - containerPort: 3000',
      '          env:',
      '            - name: DB_HOST',
      '              valueFrom:',
      '                secretKeyRef:',
      '                  name: rds-credentials',
      '                  key: host',
      '            - name: REDIS_HOST',
      '              value: "REDIS_ENDPOINT_HERE"',
      '            - name: RABBITMQ_URL',
      '              value: "amqp://streamcore.messaging.svc.cluster.local:5672"',
      '          resources:',
      '            requests: { cpu: "100m", memory: "128Mi" }',
      '            limits:   { cpu: "500m", memory: "512Mi" }',
      '          readinessProbe:',
      '            httpGet: { path: /health, port: 3000 }',
      '            initialDelaySeconds: 10',
      'EOF',
      "",
      "# GitHub Actions auto-updates image tag on push:",
      '# sed -i "s|image: .*user-service:.*|image: REGISTRY/user-service:GIT_SHA|" \\',
      '# gitops/workloads/user-service/deployment.yaml',
      "# git commit -am 'deploy user-service:GIT_SHA'",
      "# git push",
      "# ArgoCD syncs automatically within 3 minutes",
    ],
    expect: "Services deployed via ArgoCD. Pods running with Istio sidecars injected. RabbitMQ URL reachable.",
    tools: ["ArgoCD", "GitHub Actions", "ECR"],
  },
  {
    phase: "SERVICES",
    phaseColor: "#00FFB2",
    id: "6.2",
    title: "Istio Ingress Gateway + HTTPS",
    why: "The Istio Ingress Gateway is the single entry point for all external traffic. It terminates TLS, applies rate limiting, and routes traffic to services based on hostname and path. All internal traffic between services stays within the mesh encrypted via mTLS — TLS is only terminated at the edge. This gives you one place to manage external traffic policy instead of per-service Ingress rules.",
    commands: [
      "kubectl config use-context workload",
      "",
      "# Get ingress gateway external IP",
      "kubectl get svc istio-ingressgateway -n istio-system",
      "",
      "# Create Gateway + VirtualService for routing",
      'cat > gitops/platform/gateway.yaml << \'EOF\'',
      'apiVersion: networking.istio.io/v1alpha3',
      'kind: Gateway',
      'metadata:',
      '  name: streamcore-gateway',
      '  namespace: istio-system',
      'spec:',
      '  selector:',
      '    istio: ingressgateway',
      '  servers:',
      '    - port:',
      '        number: 80',
      '        name: http',
      '        protocol: HTTP',
      '      hosts: ["api.streamcore.com"]',
      '      tls:',
      '        httpsRedirect: true',
      '    - port:',
      '        number: 443',
      '        name: https',
      '        protocol: HTTPS',
      '      tls:',
      '        mode: SIMPLE',
      '        credentialName: streamcore-tls',
      '      hosts: ["api.streamcore.com"]',
      '---',
      'apiVersion: networking.istio.io/v1alpha3',
      'kind: VirtualService',
      'metadata:',
      '  name: streamcore-routes',
      '  namespace: istio-system',
      'spec:',
      '  hosts: ["api.streamcore.com"]',
      '  gateways: ["streamcore-gateway"]',
      '  http:',
      '    - match:',
      '        - uri: { prefix: "/users" }',
      '      route:',
      '        - destination:',
      '            host: user-service.user-service.svc.cluster.local',
      '            port: { number: 80 }',
      '    - match:',
      '        - uri: { prefix: "/content" }',
      '      route:',
      '        - destination:',
      '            host: content-service.content-service.svc.cluster.local',
      '            port: { number: 80 }',
      'EOF',
      "",
      "kubectl apply -f gitops/platform/gateway.yaml",
      "",
      "# Point your domain to the gateway external IP via Route53",
      "# Then create TLS secret from cert-manager",
      "kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml",
    ],
    expect: "Gateway running. HTTP redirects to HTTPS. Routes to user-service and content-service working.",
    tools: ["Istio Gateway", "cert-manager"],
  },

  // ─── PHASE 7: LOGGING ────────────────────────────────────────────────────
  {
    phase: "LOGGING",
    phaseColor: "#A855F7",
    id: "7.1",
    title: "Loki + Promtail — Centralized Logging Stack",
    why: "Loki is Grafana's log aggregation system. It stores logs indexed only by labels (namespace, pod, service) not the full text — this is 10x cheaper than Elasticsearch. Promtail runs as a DaemonSet on every node, tails container logs, and ships them to Loki. You query logs in Grafana using LogQL, the same Grafana instance you already use for metrics. One dashboard for logs, metrics, and traces.",
    commands: [
      "kubectl config use-context workload",
      "",
      "# Install Loki stack via Helm",
      "helm repo add grafana https://grafana.github.io/helm-charts",
      "",
      'cat > gitops/platform/loki-values.yaml << \'EOF\'',
      'loki:',
      '  commonConfig:',
      '    replication_factor: 1   # single replica for dev cost saving',
      '  storage:',
      '    type: filesystem        # use S3 in prod: type: s3',
      '  schemaConfig:',
      '    configs:',
      '      - from: "2024-01-01"',
      '        store: tsdb',
      '        object_store: filesystem',
      '        schema: v13',
      '        index:',
      '          prefix: index_',
      '          period: 24h',
      '  limits_config:',
      '    retention_period: 168h  # 7 days retention',
      '    ingestion_rate_mb: 10',
      '    max_streams_per_user: 10000',
      'promtail:',
      '  config:',
      '    clients:',
      '      - url: http://loki-gateway.monitoring.svc.cluster.local/loki/api/v1/push',
      '    snippets:',
      '      pipelineStages:',
      '        - json:',
      '            expressions:',
      '              level: level',
      '              correlation_id: correlation_id',
      '              service: service',
      '        - labels:',
      '            level:',
      '            correlation_id:',
      '            service:',
      'grafana:',
      '  enabled: true',
      '  adminPassword: changeme-in-prod',
      '  datasources:',
      '    datasources.yaml:',
      '      apiVersion: 1',
      '      datasources:',
      '        - name: Loki',
      '          type: loki',
      '          url: http://loki-gateway.monitoring.svc.cluster.local',
      '          isDefault: false',
      'EOF',
      "",
      "helm install loki grafana/loki-stack \\",
      "  --namespace monitoring --create-namespace \\",
      "  -f gitops/platform/loki-values.yaml",
      "",
      "# Access Grafana",
      "kubectl port-forward svc/loki-grafana 3000:80 -n monitoring",
      "# http://localhost:3000 — admin / changeme-in-prod",
      "",
      "# Example LogQL queries in Grafana:",
      '# {namespace="user-service"} | json | level="error"',
      '# {app="user-service"} | json | correlation_id="abc-123"  ← trace a request',
      '# rate({namespace="user-service"}[5m])  ← log volume over time',
    ],
    expect: "Loki running. Promtail DaemonSet on all nodes. Logs visible in Grafana. LogQL queries working.",
    tools: ["Loki", "Promtail", "Grafana", "Helm"],
  },
  {
    phase: "LOGGING",
    phaseColor: "#A855F7",
    id: "7.2",
    title: "Structured Logging + Correlation IDs",
    why: "Structured JSON logs are queryable. Plain text logs are not. A correlation ID added at the gateway and propagated through every service call lets you reconstruct the complete journey of one user request across 6 microservices in Grafana — single LogQL query. Without this, debugging a production issue means grepping through millions of unrelated log lines.",
    commands: [
      "# Add to your Node.js services:",
      "# npm install pino pino-http uuid",
      "",
      '# src/logger.js',
      'cat > src/logger.js << \'EOF\'',
      'const pino = require("pino");',
      '',
      'const logger = pino({',
      '  level: process.env.LOG_LEVEL || "info",',
      '  formatters: {',
      '    level: (label) => ({ level: label }),',
      '  },',
      '  base: {',
      '    service: process.env.SERVICE_NAME,',
      '    version: process.env.APP_VERSION,',
      '    env: process.env.NODE_ENV,',
      '  },',
      '});',
      '',
      'module.exports = logger;',
      'EOF',
      "",
      '# src/middleware/correlationId.js',
      'cat > src/middleware/correlationId.js << \'EOF\'',
      'const { v4: uuidv4 } = require("uuid");',
      '',
      'module.exports = (req, res, next) => {',
      '  // Accept from upstream (propagate) or generate new',
      '  req.correlationId = req.headers["x-correlation-id"] || uuidv4();',
      '  res.setHeader("x-correlation-id", req.correlationId);',
      '',
      '  // Attach to all logs in this request',
      '  req.log = logger.child({ correlation_id: req.correlationId });',
      '  next();',
      '};',
      'EOF',
      "",
      "# Pass correlation ID to downstream services:",
      '# axios.get(url, {',
      '#   headers: { "x-correlation-id": req.correlationId }',
      '# });',
      "",
      "# Pass to RabbitMQ messages:",
      '# channel.sendToQueue(queue, Buffer.from(JSON.stringify({',
      '#   ...payload,',
      '#   _metadata: { correlation_id: req.correlationId, timestamp: Date.now() }',
      '# })));',
    ],
    expect: "All services logging JSON. Correlation IDs visible in Grafana logs. Single request traceable across services.",
    tools: ["Pino", "Node.js", "Grafana"],
  },

  // ─── PHASE 8: OBSERVABILITY ──────────────────────────────────────────────
  {
    phase: "OBSERVABILITY",
    phaseColor: "#FF6B35",
    id: "8.1",
    title: "Prometheus + Grafana — Metrics Stack",
    why: "Prometheus scrapes metrics from every pod annotated with prometheus.io/scrape=true. kube-prometheus-stack includes rules for Kubernetes cluster health, node resource usage, and pod-level metrics out of the box. Grafana connects to both Prometheus and Loki so you have one tool for logs and metrics. Install on the management cluster so a workload cluster incident doesn't take down your visibility.",
    commands: [
      "kubectl config use-context mgmt",
      "",
      "helm repo add prometheus-community https://prometheus-community.github.io/helm-charts",
      "",
      'cat > gitops/platform/prometheus-values.yaml << \'EOF\'',
      'grafana:',
      '  adminPassword: changeme-in-prod',
      '  ingress:',
      '    enabled: true',
      '    hosts: ["grafana.streamcore.com"]',
      '',
      'prometheus:',
      '  prometheusSpec:',
      '    retention: 15d',
      '    externalLabels:',
      '      cluster: streamcore-mgmt',
      '    additionalScrapeConfigs:',
      '      - job_name: workload-cluster-services',
      '        kubernetes_sd_configs:',
      '          - role: pod',
      '            api_server: https://WORKLOAD_CLUSTER_ENDPOINT',
      '            tls_config:',
      '              ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt',
      '        relabel_configs:',
      '          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]',
      '            action: keep',
      '            regex: "true"',
      '',
      'alertmanager:',
      '  config:',
      '    route:',
      '      group_by: [alertname, namespace]',
      '      receiver: slack-alerts',
      '    receivers:',
      '      - name: slack-alerts',
      '        slack_configs:',
      '          - api_url: YOUR_SLACK_WEBHOOK',
      '            channel: "#alerts"',
      '            title: "{{ .GroupLabels.alertname }}"',
      '            text: "{{ .CommonAnnotations.description }}"',
      'EOF',
      "",
      "helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \\",
      "  --namespace monitoring --create-namespace \\",
      "  -f gitops/platform/prometheus-values.yaml",
      "",
      "# Import dashboards: 1860 (node exporter), 315 (k8s cluster), 7362 (rabbitmq)",
      "# In Grafana: Dashboards → Import → enter ID",
    ],
    expect: "Prometheus scraping both clusters. Grafana accessible. Node and pod metrics visible. Alerts routing to Slack.",
    tools: ["Prometheus", "Grafana", "Alertmanager"],
  },

  // ─── PHASE 9: FINAL HARDENING ────────────────────────────────────────────
  {
    phase: "HARDENING",
    phaseColor: "#FACC15",
    id: "9.1",
    title: "Network Policies — Zero-Trust Pod Communication",
    why: "By default, every pod in Kubernetes can talk to every other pod. NetworkPolicies enforce that only intended traffic flows. User-service should never directly talk to the database — it goes through the data-service. RabbitMQ should only accept connections from services in the messaging namespace. This is defense-in-depth: if one pod is compromised, the blast radius is contained to what that pod is explicitly allowed to reach.",
    commands: [
      "# Deny all ingress/egress by default for app namespaces",
      'cat > gitops/platform/network-policies.yaml << \'EOF\'',
      'apiVersion: networking.k8s.io/v1',
      'kind: NetworkPolicy',
      'metadata:',
      '  name: default-deny-all',
      '  namespace: user-service',
      'spec:',
      '  podSelector: {}',
      '  policyTypes: [Ingress, Egress]',
      '---',
      '# Allow user-service to accept traffic from Istio ingress gateway only',
      'apiVersion: networking.k8s.io/v1',
      'kind: NetworkPolicy',
      'metadata:',
      '  name: allow-from-gateway',
      '  namespace: user-service',
      'spec:',
      '  podSelector:',
      '    matchLabels:',
      '      app: user-service',
      '  policyTypes: [Ingress]',
      '  ingress:',
      '    - from:',
      '        - namespaceSelector:',
      '            matchLabels:',
      '              kubernetes.io/metadata.name: istio-system',
      '---',
      '# Allow user-service egress to RDS and Redis only',
      'apiVersion: networking.k8s.io/v1',
      'kind: NetworkPolicy',
      'metadata:',
      '  name: allow-db-egress',
      '  namespace: user-service',
      'spec:',
      '  podSelector:',
      '    matchLabels:',
      '      app: user-service',
      '  policyTypes: [Egress]',
      '  egress:',
      '    - ports:',
      '        - port: 3306   # MySQL RDS',
      '        - port: 6379   # Redis',
      '        - port: 5672   # RabbitMQ',
      '        - port: 53     # DNS — always allow',
      '        - port: 443    # HTTPS outbound',
      'EOF',
      "",
      "kubectl apply -f gitops/platform/network-policies.yaml",
      "",
      "# Verify connectivity after applying",
      "kubectl exec -n user-service deploy/user-service -- curl -s content-service.content-service.svc.cluster.local",
      "# Should fail (blocked) unless you explicitly allow it",
    ],
    expect: "Default-deny in place. Services can only reach their explicitly allowed peers. Inter-service communication works via allowed paths.",
    tools: ["Kubernetes NetworkPolicy", "kubectl"],
  },
  {
    phase: "HARDENING",
    phaseColor: "#FACC15",
    id: "9.2",
    title: "HPA + PDB — Auto-Scale with Zero Downtime",
    why: "HPA scales pods up when CPU/memory is high and down when idle — automatic right-sizing. PDB (Pod Disruption Budget) guarantees at least 1 pod is always available during node drains, rolling updates, or Karpenter consolidation. Without PDB, a rolling update + simultaneous Karpenter node consolidation could take all pods offline at once. PDB is the safety net that ensures Kubernetes respects your availability requirements.",
    commands: [
      'cat > gitops/workloads/user-service/hpa-pdb.yaml << \'EOF\'',
      'apiVersion: autoscaling/v2',
      'kind: HorizontalPodAutoscaler',
      'metadata:',
      '  name: user-service',
      '  namespace: user-service',
      'spec:',
      '  scaleTargetRef:',
      '    apiVersion: apps/v1',
      '    kind: Deployment',
      '    name: user-service',
      '  minReplicas: 2',
      '  maxReplicas: 20',
      '  metrics:',
      '    - type: Resource',
      '      resource:',
      '        name: cpu',
      '        target:',
      '          type: Utilization',
      '          averageUtilization: 70',
      '    - type: Resource',
      '      resource:',
      '        name: memory',
      '        target:',
      '          type: Utilization',
      '          averageUtilization: 80',
      '  behavior:',
      '    scaleDown:',
      '      stabilizationWindowSeconds: 300  # wait 5min before scaling down',
      '      policies:',
      '        - type: Percent',
      '          value: 25',
      '          periodSeconds: 60             # scale down max 25% every 60s',
      '    scaleUp:',
      '      stabilizationWindowSeconds: 0    # scale up immediately',
      '---',
      'apiVersion: policy/v1',
      'kind: PodDisruptionBudget',
      'metadata:',
      '  name: user-service-pdb',
      '  namespace: user-service',
      'spec:',
      '  minAvailable: 1   # always keep at least 1 pod running',
      '  selector:',
      '    matchLabels:',
      '      app: user-service',
      'EOF',
      "",
      "git add . && git commit -m 'add HPA and PDB for user-service' && git push",
      "# ArgoCD deploys automatically",
      "",
      "# Watch HPA in action",
      "kubectl get hpa -n user-service --watch",
      "",
      "# Simulate load to trigger scale-up",
      "kubectl run load-test --image=busybox --rm -it --restart=Never -- \\",
      "  sh -c \"while true; do wget -q -O- http://user-service.user-service.svc.cluster.local/health; done\"",
    ],
    expect: "HPA scaling between 2-20 replicas based on CPU. PDB preventing disruptive pod terminations. Scale-up triggers within 60s of load.",
    tools: ["HPA", "PDB", "kubectl"],
  },
  {
    phase: "HARDENING",
    phaseColor: "#FACC15",
    id: "9.3",
    title: "Estimated Monthly Cost Breakdown",
    why: "CTO-level awareness: know your bill before it arrives. This stack is designed to stay under $200/month in dev. The two free-tier resources (RDS db.t3.micro and ElastiCache cache.t3.micro) eliminate the biggest database costs. Karpenter ensures you never pay for idle nodes. One NAT gateway instead of three saves $65/month. Spot instances on the workload cluster save 60-70% on EC2 costs.",
    commands: [
      "# Estimated monthly costs for this stack (us-east-1, dev environment)",
      "#",
      "# EKS Control Plane x2:           $144  ($72 each, unavoidable)",
      "# EC2 — mgmt cluster (2x t3.medium spot):  ~$20",
      "# EC2 — workload (Karpenter, ~4x t3.small): ~$25",
      "# RDS db.t3.micro (FREE TIER):     $0   (first 12 months)",
      "# ElastiCache cache.t3.micro FREE:  $0   (first 12 months)",
      "# NAT Gateway (1x):                $35",
      "# ALB (Istio Ingress):             $20",
      "# S3 (TF state + logs):            $5",
      "# Route53:                         $5",
      "# Data transfer:                   ~$10",
      "# ─────────────────────────────────────────",
      "# TOTAL (yr1 free tier):          ~$264/month",
      "# TOTAL (after free tier):        ~$330/month",
      "#",
      "# Savings vs naive setup:",
      "# 1 NAT GW instead of 3:          -$65/month",
      "# Spot for workload nodes:         -$40/month",
      "# RabbitMQ on k8s vs Amazon MQ:   -$80/month",
      "# ─────────────────────────────────────────",
      "# SAVINGS:                        ~$185/month vs naive approach",
      "",
      "# Ongoing FinOps: view top 5 services by cost",
      "aws ce get-cost-and-usage \\",
      "  --time-period Start=2024-01-01,End=2024-01-31 \\",
      "  --granularity MONTHLY \\",
      "  --metrics UnblendedCost \\",
      "  --group-by Type=SERVICE \\",
      "  --query 'ResultsByTime[0].Groups | sort_by(@, &Metrics.UnblendedCost.Amount) | reverse(@) | [:5]'",
    ],
    expect: "Bill under $270/month in year 1. Alert fires before $240. Monthly review via AWS Cost Explorer.",
    tools: ["AWS Cost Explorer", "AWS Budgets"],
  },
];

const PHASE_ORDER = ["FOUNDATION","GITOPS","FINOPS","SERVICE MESH","DATA LAYER","SERVICES","LOGGING","OBSERVABILITY","HARDENING"];
const PHASE_COLORS = {
  FOUNDATION:"#00FFB2",GITOPS:"#A855F7",FINOPS:"#FACC15",
  "SERVICE MESH":"#FF6B35","DATA LAYER":"#38BDF8",SERVICES:"#00FFB2",
  LOGGING:"#A855F7",OBSERVABILITY:"#FF6B35",HARDENING:"#FACC15"
};

function freshCTOProjectTracker(){
  const steps={};
  CTO_STEPS.forEach(s=>{steps[s.id]=false;});
  return{steps,startDate:new Date().toISOString()};
}

function CTOProject(){
  const [openStep,setOpenStep]=useState(null);
  const [tracker,setTracker]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [activePhase,setActivePhase]=useState("ALL");

  useEffect(()=>{loadData("cto_project_v1").then(d=>{setTracker(d||freshCTOProjectTracker());setLoaded(true);});}, []);
  const save=(n)=>{setTracker(n);saveData("cto_project_v1",n);};
  const toggleStep=(id)=>save({...tracker,steps:{...tracker.steps,[id]:!tracker.steps?.[id]}});
  const resetT=()=>save(freshCTOProjectTracker());

  const doneCount=tracker?Object.values(tracker.steps).filter(Boolean).length:0;
  const pct=Math.round((doneCount/CTO_STEPS.length)*100);
  const filteredSteps=activePhase==="ALL"?CTO_STEPS:CTO_STEPS.filter(s=>s.phase===activePhase);

  if(!loaded) return <div style={{color:"#A855F7",padding:40,textAlign:"center",fontFamily:"monospace",fontSize:11,letterSpacing:3}}>LOADING...</div>;

  return(
    <div>
      {/* Header stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:20}}>
        {[
          {l:"STEPS DONE",v:doneCount,t:CTO_STEPS.length,c:"#00FFB2"},
          {l:"PHASES",v:PHASE_ORDER.length,t:PHASE_ORDER.length,c:"#A855F7"},
          {l:"PROGRESS",v:pct,t:100,c:"#FACC15",unit:"%"},
          {l:"EST. COST",v:"~$264",t:null,c:"#FF6B35",raw:true},
        ].map(s=>(
          <div key={s.l} style={{background:"#0D1117",border:`1px solid ${s.c}25`,borderTop:`3px solid ${s.c}`,padding:"12px 14px",borderRadius:4}}>
            <div style={{fontSize:8,color:"#4A5568",letterSpacing:3,marginBottom:5}}>{s.l}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:s.raw?16:22,fontWeight:800,color:s.c}}>
              {s.raw?s.v:s.v}
              {!s.raw&&!s.unit&&<span style={{fontSize:10,color:"#4A5568",fontFamily:"inherit",fontWeight:400}}> / {s.t}</span>}
              {s.unit&&<span style={{fontSize:12,color:s.c}}>{s.unit}</span>}
            </div>
            {!s.raw&&(
              <div style={{background:"#1A2030",height:3,borderRadius:2,marginTop:6}}>
                <div className="bar" style={{background:s.c,height:"100%",width:`${s.unit?s.v:Math.round((s.v/s.t)*100)}%`,borderRadius:2}}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div style={{background:"#0D1117",border:"1px solid #1A2030",borderRadius:4,padding:"12px 16px",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontSize:9,color:"#4A5568",letterSpacing:3}}>DEPLOYMENT PROGRESS</span>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#00FFB2"}}>{pct}%</span>
        </div>
        <div style={{background:"#1A2030",height:6,borderRadius:3}}>
          <div className="bar" style={{background:"linear-gradient(90deg,#00FFB2,#A855F7,#FACC15)",height:"100%",width:`${pct}%`,borderRadius:3}}/>
        </div>
        {tracker?.startDate&&<div style={{fontSize:9,color:"#4A5568",marginTop:6}}>Started: {new Date(tracker.startDate).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>}
      </div>

      {/* Phase filter */}
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:20}}>
        {["ALL",...PHASE_ORDER].map(p=>{
          const count=CTO_STEPS.filter(s=>s.phase===p).length;
          const done=CTO_STEPS.filter(s=>s.phase===p&&tracker?.steps[s.id]).length;
          const col=PHASE_COLORS[p]||"#4A5568";
          return(
            <button key={p} className="fb" onClick={()=>setActivePhase(p)} style={{
              background:activePhase===p?`${col}18`:"#0D1117",
              color:activePhase===p?col:"#4A5568",
              border:`1px solid ${activePhase===p?`${col}50`:"#1A2030"}`,
              fontSize:9,padding:"5px 10px",letterSpacing:1,textTransform:"uppercase"
            }}>
              {p}
              {p!=="ALL"&&<span style={{marginLeft:5,opacity:0.7}}>{done}/{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Steps */}
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {filteredSteps.map(step=>{
          const isOpen=openStep===step.id;
          const done=tracker?.steps[step.id]||false;
          const col=PHASE_COLORS[step.phase]||"#00FFB2";
          return(
            <div key={step.id}>
              <div className={`wk${isOpen?" on":""}`}
                onClick={()=>setOpenStep(isOpen?null:step.id)}
                style={{background:done?"#0A140A":"#0D1117",borderRadius:isOpen?"4px 4px 0 0":4,padding:"14px 18px",borderLeft:`3px solid ${done?"#00FFB2":col}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:7}}>
                  <div style={{display:"flex",alignItems:"center",gap:11}}>
                    <span onClick={e=>{e.stopPropagation();toggleStep(step.id);}} className="chk"
                      style={{fontSize:16,color:done?"#00FFB2":"#2A3040",flexShrink:0}}>
                      {done?"☑":"☐"}
                    </span>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:9,color:col,letterSpacing:2,background:`${col}15`,padding:"1px 6px",borderRadius:2}}>{step.phase}</span>
                        <span style={{fontSize:9,color:"#4A5568"}}>{step.id}</span>
                      </div>
                      <div style={{fontSize:12,color:done?"#4A5568":"#E8EAF0",marginTop:2,textDecoration:done?"line-through":"none"}}>{step.title}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{display:"flex",gap:4}}>
                      {step.tools.slice(0,3).map(t=>(
                        <span key={t} style={{fontSize:8,color:"#4A5568",background:"#1A2030",padding:"1px 5px",borderRadius:2}}>{t}</span>
                      ))}
                    </div>
                    <span style={{color:"#4A5568",fontSize:10}}>{isOpen?"▲":"▼"}</span>
                  </div>
                </div>
              </div>

              {isOpen&&(
                <div style={{background:"#0A0E14",border:"1px solid #1A2030",borderTop:"none",borderRadius:"0 0 4px 4px",padding:"20px 18px"}}>
                  {/* WHY */}
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:9,color:col,letterSpacing:3,marginBottom:8}}>WHY WE'RE DOING THIS</div>
                    <div style={{fontSize:12,color:"#A0A8B8",lineHeight:1.8,background:"#060A0E",border:`1px solid ${col}20`,borderLeft:`3px solid ${col}`,padding:"12px 16px",borderRadius:"0 4px 4px 0"}}>
                      {step.why}
                    </div>
                  </div>

                  {/* COMMANDS */}
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:9,color:"#00FFB2",letterSpacing:3,marginBottom:8}}>COMMANDS</div>
                    <CopyableCodeBlock lines={step.commands}/>
                  </div>

                  {/* EXPECT */}
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,background:"#0D1A12",border:"1px solid #00FFB230",padding:"10px 14px",borderRadius:4,marginBottom:16}}>
                    <span style={{color:"#00FFB2",fontSize:14,flexShrink:0}}>✓</span>
                    <div>
                      <div style={{fontSize:9,color:"#00FFB2",letterSpacing:2,marginBottom:3}}>WHAT YOU SHOULD SEE</div>
                      <div style={{fontSize:11,color:"#A0A8B8",lineHeight:1.6}}>{step.expect}</div>
                    </div>
                  </div>

                  {/* Mark complete */}
                  <button className="sc" onClick={e=>{e.stopPropagation();toggleStep(step.id);}}
                    style={{background:done?"#00FFB220":"#1A2030",color:done?"#00FFB2":"#4A5568",fontSize:9,padding:"6px 14px",letterSpacing:2,textTransform:"uppercase",border:`1px solid ${done?"#00FFB240":"#2A3040"}`}}>
                    {done?"☑ COMPLETED — CLICK TO UNDO":"☐ MARK AS COMPLETE"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{textAlign:"center",paddingTop:16,marginTop:16,borderTop:"1px solid #1A2030"}}>
        <button onClick={()=>{if(window.confirm("Reset all deployment progress?"))resetT();}}
          style={{background:"transparent",color:"#4A5568",border:"1px solid #1A2030",fontSize:9,padding:"7px 14px",letterSpacing:2,cursor:"pointer",borderRadius:3}}>
          ↺ RESET PROGRESS
        </button>
      </div>
    </div>
  );
}

function CopyableCodeBlock({lines}){
  const [copied,setCopied]=useState(false);
  const text=lines.join('\n');
  return(
    <div style={{background:"#060A0E",border:"1px solid #1A2030",borderRadius:4,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 14px",background:"#0D1117",borderBottom:"1px solid #1A2030"}}>
        <span style={{fontSize:8,color:"#00FFB2",letterSpacing:2}}>BASH</span>
        <button onClick={()=>{navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1500);});}}
          style={{background:"none",border:"none",cursor:"pointer",color:copied?"#00FFB2":"#4A5568",fontSize:9,letterSpacing:1,padding:"2px 6px"}}>
          {copied?"✓ COPIED":"COPY ALL"}
        </button>
      </div>
      <pre style={{margin:0,padding:"14px",overflowX:"auto",fontSize:10,lineHeight:1.75,color:"#C9D1D9",fontFamily:"'DM Mono','Fira Mono',monospace",whiteSpace:"pre"}}>
        {lines.map((line,i)=>{
          const isComment=line.trim().startsWith('#');
          const isEmpty=line.trim()==='';
          return(
            <span key={i} style={{color:isComment?"#4A6A4A":isEmpty?"transparent":"#C9D1D9",display:"block"}}>
              {isEmpty?" ":line}
            </span>
          );
        })}
      </pre>
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
  const ctoProjectDone = (() => {
    try{const d=JSON.parse(localStorage.getItem("cto_project_v1")||"{}");return Object.values(d.steps||{}).filter(Boolean).length;}catch{return 0;}
  })();

  const plans = {
    ai: {
      accent: "#00FFB2",
      icon: "◈",
      label: "AI Infra Plan",
      badge: aiDoneWeeks > 0 ? `${aiDoneWeeks}/12` : null,
      header: "SURVIVE THE NEXT 10 YEARS",
      sub: "DevOps → AI Infrastructure Engineer · 12 Weeks · All materials embedded",
      note: "Months 1–3",
    },
    project: {
      accent: "#FF6B35",
      icon: "◆",
      label: "CTO Project",
      badge: ctoProjectDone > 0 ? `${ctoProjectDone}/${CTO_STEPS.length}` : null,
      header: "DEPLOY STREAMCORE",
      sub: "Multi-cluster EKS · Istio · ArgoCD · RabbitMQ · Redis · Loki · FinOps",
      note: "Real project. Real commands. CTO-level decisions.",
    },
  };

  const active = plans[activePlan];

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
            <span style={{fontSize:9,color:"#4A5568",letterSpacing:2}}>10-Year Survival Plan</span>
          </div>
          <div style={{display:"flex",gap:4}}>
            {Object.entries(plans).map(([key,plan])=>(
              <button key={key} className="ntb" onClick={()=>setActivePlan(key)} style={{
                background:activePlan===key?`${plan.accent}18`:"transparent",
                color:activePlan===key?plan.accent:"#4A5568",
                border:`1px solid ${activePlan===key?`${plan.accent}40`:"#1A2030"}`,
                padding:"8px 14px",fontSize:10,letterSpacing:2,borderRadius:4,textTransform:"uppercase"
              }}>
                <span style={{marginRight:6}}>{plan.icon}</span>
                {plan.label}
                {plan.badge&&<span style={{marginLeft:6,background:`${plan.accent}20`,color:plan.accent,fontSize:8,padding:"1px 5px",borderRadius:2}}>{plan.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PLAN HEADER */}
      <div style={{background:`linear-gradient(180deg,${activePlan==="ai"?"#0D1A12":"#100D0A"} 0%,#080C10 100%)`,borderBottom:`1px solid ${active.accent}40`,padding:"32px 20px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:"35%",height:"100%",background:`radial-gradient(ellipse at top right,${active.accent}15 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{fontSize:9,color:active.accent,letterSpacing:4,textTransform:"uppercase",marginBottom:8}}>
            {active.icon} {activePlan==="ai"?"PHASE 1 OF 2 · 12 WEEKS · AI INFRASTRUCTURE":"LIVE PROJECT · STEP-BY-STEP · CTO DECISIONS"}
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(22px,4vw,42px)",fontWeight:800,color:"#FFF",letterSpacing:-1,marginBottom:6}}>
            {active.header}
          </h1>
          <p style={{color:active.accent,fontSize:12,letterSpacing:1,marginBottom:4}}>{active.sub}</p>
          <p style={{color:"#4A5568",fontSize:10}}>{active.note}</p>
        </div>
      </div>

      {/* PLAN CONTENT */}
      <div style={{maxWidth:1000,margin:"0 auto",padding:"24px 20px"}}>
        {activePlan==="ai" ? <AIPlan/> : <CTOProject/>}
      </div>

      {/* FOOTER */}
      <div style={{borderTop:"1px solid #1A2030",padding:"14px 20px",marginTop:20}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap"}}>
          {(activePlan==="ai"?
            ["Wk1-4: Foundation","Wk5-6: AI Agents","Wk7-8: Complex Arch","Wk9-10: GPU Infra","Wk11-12: Capstone"]:
            ["1: Foundation","2: GitOps","3: FinOps","4: Istio","5: Data Layer","6: Services","7: Logging","8: Observability","9: Hardening"]
          ).map((s,i)=>(
            <div key={i} style={{fontSize:9,color:"#4A5568",letterSpacing:1}}>
              <span style={{color:active.accent,marginRight:4}}>{active.icon}</span>{s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
