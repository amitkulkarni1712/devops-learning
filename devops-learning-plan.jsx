import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const WEEKS = [
  {
    week:1, phase:"FOUNDATION", phaseColor:"#00FFB2", pillar:"P1", hours:28,
    title:"LLM Infra Basics — Local to Served",
    skills:["Deploy LLMs locally: Ollama, LM Studio","Understand tokenization + inference pipeline (ops lens)","Run Llama3/Mistral via REST API","OpenAI-compatible endpoint basics","First Prometheus metrics for inference"],
    projects:[
      {name:"Local LLM Stack",desc:"Ollama + Open WebUI on Docker Compose. Expose API, test with curl, monitor with Prometheus.",hard:false},
    ],
    tools:["Ollama","Docker Compose","Prometheus","curl"],
    resources:[
      {type:"docs",label:"vLLM Official Docs",url:"https://docs.vllm.ai",note:"Start here. Engine args, OpenAI-compatible API, metrics."},
      {type:"docs",label:"Ollama GitHub + Docs",url:"https://github.com/ollama/ollama",note:"Modelfile format, REST API, GPU config flags."},
      {type:"docs",label:"OpenAI API Spec (the standard)",url:"https://platform.openai.com/docs/api-reference",note:"vLLM + Ollama implement this spec — know it cold."},
      {type:"course",label:"LLMOps — DeepLearning.AI (FREE)",url:"https://www.deeplearning.ai/short-courses/llmops/",note:"2hr focused course on deployment pipelines."},
      {type:"video",label:"Andrej Karpathy — Intro to LLMs (1hr)",url:"https://www.youtube.com/watch?v=zjkBMFhNj_g",note:"Pure mental model for what you're operating. Watch first."},
      {type:"video",label:"TechWorld with Nana — LLM on Docker",url:"https://www.youtube.com/watch?v=GZiYVB_zbFo",note:"Practical local LLM setup walkthrough."},
      {type:"book",label:"LLM Engineer's Handbook — Packt 2024",url:"https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072",note:"Chapters 1–3 this week. Foundations + serving basics."},
    ],
  },
  {
    week:2, phase:"FOUNDATION", phaseColor:"#00FFB2", pillar:"P1", hours:30,
    title:"Production LLM Serving — vLLM, Triton, Gateway",
    skills:["Deploy vLLM on Kubernetes","Triton Inference Server: model repository + backends","API gateway (Kong/NGINX) in front of LLMs","Rate limiting, token tracking, auth","Grafana dashboards: latency, TTFT, tokens/sec"],
    projects:[
      {name:"LLM API Gateway",desc:"vLLM behind Kong on k8s. Rate limiting, token tracking, Grafana dashboard for p95/p99 latency + TTFT.",hard:true},
      {name:"Inference Benchmarker",desc:"Load-test your endpoint with LLMPerf. Measure p95/p99, TTFT, tokens/sec. Auto-generate HTML report.",hard:false},
    ],
    tools:["vLLM","Triton","Kong","Grafana","k8s"],
    resources:[
      {type:"docs",label:"NVIDIA Triton Inference Server Docs",url:"https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/",note:"Model repository, backends, dynamic batching config."},
      {type:"docs",label:"Kong Gateway Docs",url:"https://docs.konghq.com/gateway/latest/",note:"Rate limiting plugin + prometheus plugin. Both used in project."},
      {type:"course",label:"Full Stack LLM Bootcamp — Berkeley (FREE)",url:"https://fullstackdeeplearning.com/llm-bootcamp/",note:"End-to-end LLM deployment. Watch Week 1–2 material."},
      {type:"video",label:"vLLM Paper Walkthrough — Yannic Kilcher",url:"https://www.youtube.com/watch?v=80bIUggRJf4",note:"Paged attention — understand why vLLM is fast."},
      {type:"repo",label:"vLLM GitHub — examples/",url:"https://github.com/vllm-project/vllm",note:"Read the examples/ folder end-to-end before coding."},
      {type:"repo",label:"LLMPerf — Ray Benchmark Tool",url:"https://github.com/ray-project/llmperf",note:"Use directly for your benchmarker project."},
      {type:"repo",label:"Awesome LLM Inference",url:"https://github.com/DefTruth/Awesome-LLM-Inference",note:"Curated optimization techniques and tools."},
    ],
  },
  {
    week:3, phase:"FOUNDATION", phaseColor:"#00FFB2", pillar:"P2", hours:28,
    title:"MLOps Foundations — Data, Experiments, Registry",
    skills:["Data versioning with DVC + S3/MinIO","Self-hosted MLflow: tracking + experiment UI","Model registry: versions, stages, aliases","MinIO as artifact store on k8s","Understanding ML metadata lineage"],
    projects:[
      {name:"Self-Hosted MLOps Stack",desc:"MLflow + MinIO on k8s via Helm. Track a real training run, version the model, promote dev→staging with quality gate.",hard:false},
    ],
    tools:["MLflow","DVC","MinIO","Helm","k8s"],
    resources:[
      {type:"docs",label:"MLflow Docs — Model Registry",url:"https://mlflow.org/docs/latest/model-registry.html",note:"Registry API, stages, aliases — core to the project."},
      {type:"docs",label:"DVC Official Docs",url:"https://dvc.org/doc",note:"Data versioning + pipeline definitions. Work through Get Started fully."},
      {type:"course",label:"Made With ML — Full MLOps Course (FREE)",url:"https://madewithml.com",note:"Best free MLOps resource. Goku Mohandas. Do all of it."},
      {type:"course",label:"MLOps Zoomcamp — DataTalks.Club (FREE)",url:"https://github.com/DataTalksClub/mlops-zoomcamp",note:"Hands-on. All code on GitHub. Best for practice."},
      {type:"video",label:"DataTalks.Club YouTube",url:"https://www.youtube.com/c/DataTalksClub",note:"Weekly walkthroughs of real-world MLOps pipelines."},
      {type:"book",label:"Designing Machine Learning Systems — Chip Huyen",url:"https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",note:"THE reference. Read Chapters 6 + 9 before this week."},
      {type:"repo",label:"MLOps Zoomcamp GitHub",url:"https://github.com/DataTalksClub/mlops-zoomcamp",note:"Clone and work through every module."},
    ],
  },
  {
    week:4, phase:"FOUNDATION", phaseColor:"#00FFB2", pillar:"P2", hours:30,
    title:"MLOps Pipeline — Features, CI/CD, Automated Deploy",
    skills:["Feature store concepts: Feast on k8s","CI/CD for ML: retrain → validate → deploy","GitHub Actions ML pipeline","Model performance gates before promotion","Feast online/offline store split"],
    projects:[
      {name:"End-to-End MLOps Pipeline",desc:"GitHub Actions → DVC pull data → train → MLflow log → promote if metrics pass → auto-deploy to vLLM endpoint. Full automated cycle.",hard:true},
      {name:"Model Registry Gate",desc:"MLflow promotion gates dev→staging→prod. Slack notification on failures. Rollback on degraded metrics.",hard:false},
    ],
    tools:["MLflow","Feast","GitHub Actions","DVC","Slack API"],
    resources:[
      {type:"docs",label:"Feast Feature Store Docs",url:"https://docs.feast.dev",note:"Architecture overview → k8s deployment guide."},
      {type:"course",label:"MLOps Specialization — Andrew Ng (FREE audit)",url:"https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops",note:"Courses 2–4 are most relevant. Audit is free."},
      {type:"video",label:"ML in Production — CMU Lectures (YouTube)",url:"https://www.youtube.com/playlist?list=PLmamF3YkHLoKdWz6ULQfmchFkfP-9PVAw",note:"Lectures 8–12 on deployment + monitoring."},
      {type:"book",label:"Introducing MLOps — O'Reilly",url:"https://www.oreilly.com/library/view/introducing-mlops/9781492083283/",note:"Good fast mental model. Read before Week 4 projects."},
      {type:"repo",label:"ZenML — Production MLOps Framework",url:"https://github.com/zenml-io/zenml",note:"Study how a real MLOps framework is structured."},
    ],
  },
  {
    week:5, phase:"CORE AI", phaseColor:"#FF6B35", pillar:"P3", hours:32,
    title:"Build AI Agents — From Zero",
    skills:["Agent architecture: ReAct, Plan-and-Execute, Reflexion","LangGraph for stateful multi-step agents","Tool calling: bash, k8s API, AWS SDK","Memory: short-term (context) + long-term (vector DB)","Agent observability: traces, token costs, call graphs"],
    projects:[
      {name:"Runbook Agent",desc:"Feed agent your runbooks (PDFs/MD). Responds to PagerDuty alerts, walks through steps, reports outcomes back to Slack.",hard:false},
    ],
    tools:["LangGraph","LangChain","Qdrant","LangFuse","Slack API"],
    resources:[
      {type:"docs",label:"LangGraph Official Docs",url:"https://langchain-ai.github.io/langgraph/",note:"Concepts → How-to → Tutorials. Do ALL tutorials before coding."},
      {type:"docs",label:"Anthropic Tool Use Docs",url:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use",note:"Foundation of every agent. Master parallel + sequential calls."},
      {type:"docs",label:"LangFuse Self-Hosted Docs",url:"https://langfuse.com/docs/deployment/self-host",note:"Deploy on k8s. Instrument all agents from Day 1."},
      {type:"course",label:"AI Agents in LangGraph — DeepLearning.AI (FREE)",url:"https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",note:"Best intro to LangGraph. Do this Day 1 of Week 5."},
      {type:"course",label:"Building Agentic RAG — DeepLearning.AI (FREE)",url:"https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/",note:"Runbook agent relies on RAG — do this before coding."},
      {type:"video",label:"LangGraph Full Build Tutorial",url:"https://www.youtube.com/watch?v=R-o_a6dvzQM",note:"2hr walkthrough building real agents. Watch before coding."},
      {type:"book",label:"AI Engineering — Chip Huyen (2025)",url:"https://www.oreilly.com/library/view/ai-engineering/9781098166298/",note:"Chapters on agents + tool use are essential."},
      {type:"repo",label:"LangGraph GitHub Examples",url:"https://github.com/langchain-ai/langgraph/tree/main/examples",note:"Run every example before writing your own agent."},
      {type:"repo",label:"OpenAI Swarm (tiny multi-agent framework)",url:"https://github.com/openai/swarm",note:"~200 lines. Read the source — incredibly educational."},
    ],
  },
  {
    week:6, phase:"CORE AI", phaseColor:"#FF6B35", pillar:"P3", hours:32,
    title:"AI Agents Managing Infrastructure",
    skills:["MCP (Model Context Protocol) servers for infra tools","Agent + Terraform: plan, review, apply cycle","Multi-agent patterns for complex infra tasks","Human-in-the-loop approval workflows","Security guardrails for autonomous agents"],
    projects:[
      {name:"K8s Ops Agent",desc:"Agent detects OOMKilled pods, analyzes logs, proposes fix (scale/tweak limits), applies after Slack approval. Full feedback loop.",hard:true},
      {name:"Autonomous FinOps Agent",desc:"Scans AWS Cost Explorer, identifies waste, generates Terraform PRs to fix it, routes to human for approval via Slack.",hard:true},
    ],
    tools:["MCP","Terraform","AWS SDK","Anthropic API","GitHub"],
    resources:[
      {type:"docs",label:"MCP Specification — Anthropic",url:"https://modelcontextprotocol.io/docs",note:"Read full spec. Then build a server from scratch."},
      {type:"docs",label:"MCP Servers Directory (GitHub)",url:"https://github.com/modelcontextprotocol/servers",note:"AWS, GitHub, Terraform all have implementations. Study them."},
      {type:"docs",label:"AWS Cost Explorer API Docs",url:"https://docs.aws.amazon.com/cost-management/latest/APIReference/API_GetCostAndUsage.html",note:"Your FinOps agent calls this. Know the filter syntax."},
      {type:"course",label:"Building MCP Servers — Anthropic Tutorial (FREE)",url:"https://modelcontextprotocol.io/tutorials/building-mcp-with-llms",note:"Official tutorial. Get a working MCP server in 2 hours."},
      {type:"course",label:"Multi AI Agent Systems — crewAI / DeepLearning.AI (FREE)",url:"https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/",note:"Multi-agent patterns before building your K8s agent."},
      {type:"video",label:"MCP Explained + Full Demo",url:"https://www.youtube.com/watch?v=7j_NE6Pjv-E",note:"Best MCP explainer. Watch before reading the spec."},
      {type:"video",label:"Human-in-the-Loop AI Systems",url:"https://www.youtube.com/watch?v=Bp3K7TCy3Lk",note:"Watch before writing approval logic — critical for safety."},
      {type:"repo",label:"Anthropic Quickstarts",url:"https://github.com/anthropics/anthropic-quickstarts",note:"Production-quality agent templates from the Anthropic team."},
      {type:"repo",label:"Terraform MCP Server (tfmcp)",url:"https://github.com/nwiizo/tfmcp",note:"Study for your drift detector + FinOps agent implementation."},
      {type:"repo",label:"Awesome AI Agents — e2b",url:"https://github.com/e2b-dev/awesome-ai-agents",note:"See what production agents look like. Steal patterns."},
    ],
  },
  {
    week:7, phase:"COMPLEX ARCH", phaseColor:"#A855F7", pillar:"P1", hours:32,
    title:"Complex Architecture Pt.1 — Service Mesh + Multi-Cluster",
    skills:["Istio deep dive: mTLS, traffic shaping, circuit breaking","Linkerd as lighter alternative","Multi-cluster k8s: Cluster API + ArgoCD","App of Apps GitOps pattern","Cross-cluster traffic + service discovery"],
    projects:[
      {name:"Multi-Cluster AI Platform",desc:"3-cluster setup (management + 2 workload). ArgoCD manages all via App-of-Apps. Istio cross-cluster mTLS. One cluster for GPU inference.",hard:true},
    ],
    tools:["Istio","ArgoCD","Cluster API","Linkerd","Helm"],
    resources:[
      {type:"docs",label:"Istio Official Docs",url:"https://istio.io/latest/docs/",note:"Traffic management → Security → Observability. Do all Tasks hands-on."},
      {type:"docs",label:"ArgoCD — Multi-Cluster Setup",url:"https://argo-cd.readthedocs.io/en/stable/user-guide/cluster-bootstrapping/",note:"App of Apps pattern + multi-cluster register. Core to your project."},
      {type:"docs",label:"Cluster API Docs",url:"https://cluster-api.sigs.k8s.io/",note:"Provider model, bootstrapping, upgrade strategies."},
      {type:"course",label:"Istio Service Mesh Hands-On (Udemy)",url:"https://www.udemy.com/course/istio-hands-on-for-kubernetes/",note:"Deep on traffic policies + Envoy config."},
      {type:"course",label:"GitOps with ArgoCD — Codefresh (FREE cert)",url:"https://codefresh.io/learn/argo-cd/",note:"Free certification. Strong multi-cluster section."},
      {type:"video",label:"TechWorld with Nana — ArgoCD Full Course (3hr)",url:"https://www.youtube.com/watch?v=MeU5_k9ssrs",note:"Best free ArgoCD deep dive on YouTube."},
      {type:"book",label:"Designing Distributed Systems — Brendan Burns (FREE PDF)",url:"https://azure.microsoft.com/en-us/resources/designing-distributed-systems/",note:"Free from Microsoft. The k8s creator. Chapters 1–6."},
    ],
  },
  {
    week:8, phase:"COMPLEX ARCH", phaseColor:"#A855F7", pillar:"P1", hours:32,
    title:"Complex Architecture Pt.2 — Kafka, Events & Chaos",
    skills:["Apache Kafka: partitions, consumer groups, Schema Registry","Kafka Connect for ML feature ingestion","CQRS + Event Sourcing patterns","Chaos Mesh: fault injection automation","Chaos in CI: resilience as code"],
    projects:[
      {name:"Kafka-Driven ML Feature Pipeline",desc:"Real-time feature computation: Kafka Streams → Feast online store → features available to live inference endpoint within 100ms.",hard:true},
      {name:"Chaos Test Suite",desc:"Chaos Mesh scenarios for your multi-cluster setup: pod kill, network partition, I/O delay. Run in CI. Assert recovery SLOs.",hard:false},
    ],
    tools:["Kafka","Kafka Connect","Chaos Mesh","Schema Registry","Feast"],
    resources:[
      {type:"docs",label:"Confluent Kafka Docs",url:"https://docs.confluent.io/platform/current/",note:"Better than Apache docs. Schema Registry + Kafka Connect are key."},
      {type:"docs",label:"Chaos Mesh Docs",url:"https://chaos-mesh.org/docs/",note:"Inject pod failures, network partitions, I/O faults."},
      {type:"course",label:"Apache Kafka Series — Stéphane Maarek (Udemy)",url:"https://www.udemy.com/course/apache-kafka/",note:"Best Kafka course in existence. Do this before the project."},
      {type:"video",label:"Hussein Nasser — Kafka Internals",url:"https://www.youtube.com/watch?v=R873BlNVUqQ",note:"Partitions, replication, consumer groups with diagrams."},
      {type:"book",label:"Kafka: The Definitive Guide 2nd Ed (FREE from Confluent)",url:"https://www.confluent.io/resources/kafka-the-definitive-guide-v2/",note:"Free PDF. Read Chapters 1, 3, 7, 9."},
      {type:"repo",label:"Chaos Mesh GitHub",url:"https://github.com/chaos-mesh/chaos-mesh",note:"Read workflow examples. Automate chaos in CI pipeline."},
    ],
  },
  {
    week:9, phase:"COMPLEX ARCH", phaseColor:"#A855F7", pillar:"P4", hours:30,
    title:"GPU Infra Pt.1 — NVIDIA Operator, MIG, Time-Slicing",
    skills:["NVIDIA GPU Operator on k8s","MIG (Multi-Instance GPU) configuration","GPU time-slicing for shared workloads","Device plugin + resource requests","GPU monitoring: DCGM + Grafana"],
    projects:[
      {name:"GPU k8s Cluster",desc:"GPU Operator on k8s. Configure MIG on A100 (or emulate). Time-slicing for inference pods. DCGM metrics in Grafana. Enforce GPU quotas per namespace.",hard:true},
    ],
    tools:["NVIDIA GPU Operator","DCGM","MIG","k8s","Grafana"],
    resources:[
      {type:"docs",label:"NVIDIA GPU Operator Docs",url:"https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html",note:"MIG config, time-slicing, device plugin. Do the k8s quickstart."},
      {type:"docs",label:"NVIDIA DCGM Docs",url:"https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/index.html",note:"GPU health metrics for Prometheus. Used in your Grafana dashboard."},
      {type:"course",label:"NVIDIA DLI — Kubernetes for GPU (FREE with NGC)",url:"https://courses.nvidia.com/courses/course-v1:DLI+C-ML-01+V1/",note:"Hands-on GPU k8s from NVIDIA. Sign up for NGC — it's free."},
      {type:"video",label:"GPU Infrastructure at Scale — KubeCon 2024",url:"https://www.youtube.com/watch?v=Qe5-O_FYKtw",note:"Real production GPU cluster setup. Exactly your project."},
      {type:"repo",label:"NVIDIA GPU Operator GitHub",url:"https://github.com/NVIDIA/gpu-operator",note:"Study the Helm chart values. Know every flag before deploying."},
    ],
  },
  {
    week:10, phase:"COMPLEX ARCH", phaseColor:"#A855F7", pillar:"P4", hours:32,
    title:"GPU Infra Pt.2 — Ray, Distributed Training, Autoscaling",
    skills:["Distributed training: Ray Train, PyTorch DDP on k8s","Model parallelism concepts (tensor/pipeline)","KEDA autoscaling with GPU queue depth metrics","Karpenter for GPU node provisioning","Spot/preemptible GPU strategy for training jobs"],
    projects:[
      {name:"GPU Cluster Autoscaler",desc:"KEDA watches vLLM inference queue → scales pods → Karpenter provisions GPU nodes. Full cycle under load test. Spot handling.",hard:true},
      {name:"Distributed Training Orchestrator",desc:"Ray on k8s: submit training job, auto-recover on spot interruption, checkpoint to S3, Slack notification on completion.",hard:false},
    ],
    tools:["Ray","KEDA","Karpenter","PyTorch","KubeRay"],
    resources:[
      {type:"docs",label:"KubeRay — Ray on Kubernetes",url:"https://docs.ray.io/en/latest/cluster/kubernetes/index.html",note:"RayCluster CRD, autoscaling, head/worker config."},
      {type:"docs",label:"KEDA Docs — Prometheus Scaler",url:"https://keda.sh/docs/2.14/scalers/prometheus/",note:"GPU queue depth metrics → scale vLLM pods. Your project core."},
      {type:"docs",label:"Karpenter Docs",url:"https://karpenter.sh/docs/",note:"NodePools, GPU instance types, spot interruption handling."},
      {type:"docs",label:"PyTorch DDP Tutorial",url:"https://pytorch.org/tutorials/intermediate/ddp_tutorial.html",note:"Understand what you're orchestrating before orchestrating it."},
      {type:"course",label:"Ray Educational Materials — GitHub (FREE)",url:"https://github.com/ray-project/ray-educational-materials",note:"Official Ray training. Work through ML Platform guide fully."},
      {type:"video",label:"Karpenter Deep Dive — AWS re:Invent",url:"https://www.youtube.com/watch?v=43g8uPohTgc",note:"Spot + GPU provisioning patterns. Essential."},
      {type:"video",label:"Anyscale YouTube Channel",url:"https://www.youtube.com/c/Anyscale-ray",note:"All Ray training videos from the makers. Subscribe + binge."},
      {type:"book",label:"Distributed Machine Learning Patterns — Manning",url:"https://www.manning.com/books/distributed-machine-learning-patterns",note:"Chapters 3–5: checkpoint strategy + failure recovery."},
      {type:"repo",label:"Ray Project GitHub — train/examples",url:"https://github.com/ray-project/ray",note:"Read python/ray/train/examples/ for distributed training patterns."},
    ],
  },
  {
    week:11, phase:"ADVANCED", phaseColor:"#FACC15", pillar:"P1", hours:28,
    title:"Observability, Security & Compliance for AI",
    skills:["LLM observability: LangFuse, Arize Phoenix","Prompt injection + input/output guardrails","Model drift detection: Evidently AI, whylogs","AI-specific RBAC + audit logging","SOC2/GDPR compliance patterns for AI workloads"],
    projects:[
      {name:"AI Observability Stack",desc:"LangFuse + Evidently + Grafana unified dashboard: token costs, latency, drift score, error rate per model. Self-hosted on k8s.",hard:true},
      {name:"Guardrails Gateway",desc:"NGINX + NeMo Guardrails checks intercepting LLM requests. Block/flag prompt injections before they hit the model. OPA policies for RBAC.",hard:false},
    ],
    tools:["LangFuse","Evidently AI","NeMo Guardrails","OPA","Falco"],
    resources:[
      {type:"docs",label:"LangFuse Self-Hosting Docs",url:"https://langfuse.com/docs/deployment/self-host",note:"Helm deployment on k8s. Your project starts here."},
      {type:"docs",label:"Evidently AI Docs",url:"https://docs.evidentlyai.com",note:"Data drift, model quality, custom reports."},
      {type:"docs",label:"NVIDIA NeMo Guardrails Docs",url:"https://docs.nvidia.com/nemo/guardrails/latest/",note:"Colang syntax, rail types. Build rails for your gateway."},
      {type:"docs",label:"OWASP LLM Top 10 (FREE)",url:"https://owasp.org/www-project-top-10-for-large-language-model-applications/",note:"The security threat model for AI. Build guardrails against all 10."},
      {type:"course",label:"Red Teaming LLM Applications — DeepLearning.AI (FREE)",url:"https://www.deeplearning.ai/short-courses/red-teaming-llm-applications/",note:"Think like an attacker first. Then build your guardrails."},
      {type:"course",label:"ML Monitoring Fundamentals — Evidently AI (FREE)",url:"https://learn.evidentlyai.com",note:"Free course from Evidently creators."},
      {type:"video",label:"AI Security at Scale — KubeCon Talk",url:"https://www.youtube.com/watch?v=n3P1HkNXCaQ",note:"Threat model for AI systems in k8s."},
      {type:"book",label:"Observability Engineering — Charity Majors",url:"https://www.oreilly.com/library/view/observability-engineering/9781492076438/",note:"Foundational mental model. Chapters 1–5."},
      {type:"repo",label:"NeMo Guardrails GitHub + Examples",url:"https://github.com/NVIDIA/NeMo-Guardrails/tree/main/examples",note:"Run every example. Customize for your gateway project."},
      {type:"repo",label:"whylogs — Lightweight Drift Logging",url:"https://github.com/whylabs/whylogs",note:"Compare vs Evidently for your stack decision."},
    ],
  },
  {
    week:12, phase:"CAPSTONE", phaseColor:"#00FFB2", pillar:"P1", hours:35,
    title:"Full Production AI Platform — Build It All",
    skills:["Tie everything into a cohesive Internal AI Platform","IDP with Backstage + AI plugin ecosystem","Disaster recovery for AI workloads","FinOps dashboard: GPU cost per model/team","Document architecture decisions (ADRs)"],
    projects:[
      {name:"🏆 THE CAPSTONE: Production AI Platform",desc:"Full platform: Multi-cluster k8s + GPU nodes + MLflow + vLLM + Kafka feature pipeline + Autonomous Ops Agent + Observability stack + Backstage IDP. End-to-end deployed. ADRs written. GitHub portfolio-ready.",hard:true},
    ],
    tools:["Backstage","Terraform","ArgoCD","Everything from Weeks 1–11"],
    resources:[
      {type:"docs",label:"Backstage Official Docs",url:"https://backstage.io/docs/overview/what-is-backstage",note:"Getting Started → Plugins → Catalog. Deploy then customize."},
      {type:"docs",label:"Platform Engineering Tooling Landscape",url:"https://platformengineering.org/platform-tooling",note:"Reference architectures. Use for your ADRs."},
      {type:"docs",label:"AWS Well-Architected ML Lens (FREE)",url:"https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/welcome.html",note:"Official framework for auditing your architecture."},
      {type:"course",label:"PlatformCon 2024 Talk Library (FREE)",url:"https://platformcon.com/talks",note:"100+ talks. Filter: Backstage, IDP, AI. Watch 10."},
      {type:"video",label:"Backstage Deep Dive — TechWorld with Nana",url:"https://www.youtube.com/watch?v=USB7I7mKRsA",note:"Best Backstage getting-started video. Day 1 of Week 12."},
      {type:"video",label:"PlatformCon 2024 — Full Playlist",url:"https://www.youtube.com/watch?v=ghzsBm8vOms",note:"Production IDP case studies: Spotify, Zalando, Siemens."},
      {type:"video",label:"How to Write ADRs — Pragmatic Engineer",url:"https://www.youtube.com/watch?v=rwfXkSjFhzc",note:"Your portfolio needs these. Watch before writing any ADR."},
      {type:"book",label:"Team Topologies — Manuel Pais",url:"https://teamtopologies.com/book",note:"Your platform serves teams. Read Part 2."},
      {type:"book",label:"The Staff Engineer's Path — O'Reilly",url:"https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/",note:"After this 12 weeks, this is your career arc. Read in parallel."},
      {type:"repo",label:"Backstage GitHub",url:"https://github.com/backstage/backstage",note:"Fork it. Build your AI catalog plugin. That's your portfolio piece."},
      {type:"repo",label:"Awesome Platform Engineering",url:"https://github.com/toptechskills/awesome-platform-engineering",note:"Curated tools + blogs. Reference for architecture decisions."},
    ],
  },
];

const PILLARS = [
  {id:"P1",label:"AI-Native Platform Engineering",color:"#00FFB2",icon:"◈",why:"Platform engineers who deploy + operate AI workloads are the rarest & highest-paid role next decade."},
  {id:"P2",label:"MLOps & Model Lifecycle",color:"#FF6B35",icon:"⬡",why:"Every company will have models in prod. Someone needs to own the pipeline, drift detection & retraining loops."},
  {id:"P3",label:"AI Agents for Infrastructure",color:"#A855F7",icon:"◉",why:"Autonomous agents will replace L1/L2 ops. You must learn to build, orchestrate and guardrail them."},
  {id:"P4",label:"GPU & AI Infra at Scale",color:"#FACC15",icon:"◆",why:"CUDA clusters, inference servers, distributed training — ops for AI hardware is a decade-long moat."},
];

const SURVIVAL = [
  {skill:"AI Agent Development",urgency:"NOW",demand:10},
  {skill:"MLOps & Model Lifecycle",urgency:"NOW",demand:10},
  {skill:"GPU Infra (k8s + NVIDIA)",urgency:"NOW",demand:9},
  {skill:"Platform Engineering (IDP)",urgency:"NOW",demand:9},
  {skill:"LLM Observability & Guardrails",urgency:"NOW",demand:9},
  {skill:"Distributed Systems (Kafka/Mesh)",urgency:"SOON",demand:8},
  {skill:"FinOps for AI Workloads",urgency:"SOON",demand:8},
  {skill:"Chaos Engineering",urgency:"SOON",demand:7},
  {skill:"Multi-Cluster Kubernetes",urgency:"NEXT YEAR",demand:8},
  {skill:"Autonomous Infra Management",urgency:"NEXT YEAR",demand:10},
];

const DEAD = [
  "Manual runbooks (agents will execute them)",
  "YAML-only GitOps (IDP abstractions will dominate)",
  "Single-cloud expertise only",
  "Writing Terraform by hand without AI assistance",
  "On-call without AI triage pre-filtering",
];

const PILLAR_COLORS = {P1:"#00FFB2",P2:"#FF6B35",P3:"#A855F7",P4:"#FACC15"};
const URGENCY_COLORS = {NOW:"#00FFB2",SOON:"#FF6B35","NEXT YEAR":"#A855F7"};
const RES_META = {
  docs:  {icon:"⬡",label:"DOCS",  color:"#00FFB2"},
  course:{icon:"◈",label:"COURSE",color:"#A855F7"},
  video: {icon:"▶",label:"VIDEO", color:"#FF6B35"},
  book:  {icon:"◆",label:"BOOK",  color:"#FACC15"},
  repo:  {icon:"◉",label:"REPO",  color:"#38BDF8"},
};

const WEEK_STATUS = {NOT_STARTED:"not_started",IN_PROGRESS:"in_progress",DONE:"done"};
const STATUS_META = {
  not_started:{label:"Not Started",color:"#1A2030",textColor:"#4A5568",dot:"○"},
  in_progress:{label:"In Progress",color:"#FF6B3520",textColor:"#FF6B35",dot:"◑"},
  done:       {label:"Complete",  color:"#00FFB220",textColor:"#00FFB2",dot:"●"},
};

const TOTAL_HOURS = WEEKS.reduce((s,w)=>s+w.hours,0);
const TOTAL_RESOURCES = WEEKS.reduce((s,w)=>s+w.resources.length,0);
const ALL_PROJECTS = WEEKS.flatMap(w=>w.projects.map((p,i)=>({weekNum:w.week,projIdx:i,name:p.name,hard:p.hard,phase:w.phase,phaseColor:w.phaseColor})));

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
async function loadTracker() {
  try {
    const r = await window.storage.get("ai_tracker_v1");
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}
async function saveTracker(data) {
  try { await window.storage.set("ai_tracker_v1", JSON.stringify(data)); } catch {}
}
function freshTracker() {
  const weekStatus = {};
  const projects = {};
  WEEKS.forEach(w => {
    weekStatus[w.week] = WEEK_STATUS.NOT_STARTED;
    w.projects.forEach((_,i) => { projects[`${w.week}-${i}`] = false; });
  });
  return {weekStatus, projects, startDate: new Date().toISOString(), notes: {}};
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("roadmap");
  const [openWeek, setOpenWeek] = useState(null);
  const [resFilter, setResFilter] = useState("all");
  const [tracker, setTracker] = useState(null);
  const [trackerLoaded, setTrackerLoaded] = useState(false);

  useEffect(() => {
    loadTracker().then(data => {
      setTracker(data || freshTracker());
      setTrackerLoaded(true);
    });
  }, []);

  const saveAndSet = (next) => { setTracker(next); saveTracker(next); };

  const setWeekStatus = (weekNum, status) => {
    const next = {...tracker, weekStatus:{...tracker.weekStatus,[weekNum]:status}};
    saveAndSet(next);
  };
  const toggleProject = (key) => {
    const next = {...tracker, projects:{...tracker.projects,[key]:!tracker.projects[key]}};
    saveAndSet(next);
  };
  const resetTracker = () => { const t = freshTracker(); saveAndSet(t); };

  // Progress math
  const doneWeeks = tracker ? Object.values(tracker.weekStatus).filter(s=>s===WEEK_STATUS.DONE).length : 0;
  const inProgressWeeks = tracker ? Object.values(tracker.weekStatus).filter(s=>s===WEEK_STATUS.IN_PROGRESS).length : 0;
  const doneProjects = tracker ? Object.values(tracker.projects).filter(Boolean).length : 0;
  const totalProjects = ALL_PROJECTS.length;
  const overallPct = Math.round((doneWeeks / WEEKS.length) * 100);
  const completedHours = tracker ? WEEKS.filter(w=>tracker.weekStatus[w.week]===WEEK_STATUS.DONE).reduce((s,w)=>s+w.hours,0) : 0;

  const cycleStatus = (weekNum) => {
    const cur = tracker?.weekStatus[weekNum] || WEEK_STATUS.NOT_STARTED;
    const next = cur===WEEK_STATUS.NOT_STARTED ? WEEK_STATUS.IN_PROGRESS : cur===WEEK_STATUS.IN_PROGRESS ? WEEK_STATUS.DONE : WEEK_STATUS.NOT_STARTED;
    setWeekStatus(weekNum, next);
  };

  if (!trackerLoaded) return (
    <div style={{background:"#080C10",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#00FFB2",fontFamily:"monospace",fontSize:12,letterSpacing:3}}>
      LOADING...
    </div>
  );

  return (
    <div style={{background:"#080C10",minHeight:"100vh",color:"#E8EAF0",fontFamily:"'DM Mono','Fira Mono',monospace",padding:0}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#0D1117;} ::-webkit-scrollbar-thumb{background:#00FFB2;}
        .wk{transition:all .2s;cursor:pointer;border:1px solid #1A2030;}
        .wk:hover{border-color:#00FFB2!important;transform:translateY(-2px);}
        .wk.on{border-color:#00FFB2!important;}
        .tb{background:none;border:none;cursor:pointer;transition:opacity .15s;}
        .tb:hover{opacity:.75;}
        .bar{transition:width 1.2s ease;}
        .rl{text-decoration:none;transition:transform .15s;display:block;}
        .rl:hover{transform:translateX(4px);}
        .fb{cursor:pointer;transition:all .15s;border-radius:3px;}
        .fb:hover{opacity:.8;}
        .sc{cursor:pointer;transition:all .15s;border-radius:3px;border:none;}
        .sc:hover{opacity:.8;}
        .di::before{content:"✗ ";color:#FF4444;}
        .chk{cursor:pointer;transition:all .15s;}
        .chk:hover{opacity:.7;}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:"linear-gradient(180deg,#0D1A12 0%,#080C10 100%)",borderBottom:"1px solid #00FFB240",padding:"40px 28px 30px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:"35%",height:"100%",background:"radial-gradient(ellipse at top right,#00FFB215 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{color:"#00FFB2",fontSize:10,letterSpacing:4,textTransform:"uppercase"}}>◈ DEVOPS SURVIVAL PLAN</span>
            <span style={{color:"#1A2030"}}>//</span>
            <span style={{color:"#4A5568",fontSize:10,letterSpacing:2}}>14 yrs exp · 8 yrs DevOps</span>
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(24px,4.5vw,46px)",fontWeight:800,margin:"0 0 6px",lineHeight:1.05,color:"#FFF",letterSpacing:-1}}>
            SURVIVE THE NEXT 10 YEARS
          </h1>
          <p style={{color:"#00FFB2",fontSize:13,margin:"0 0 24px",letterSpacing:1}}>DevOps → AI Infrastructure Engineer</p>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-end"}}>
            {[["12 WEEKS","3-Month Plan"],[`${TOTAL_HOURS} HRS`,"~31h/week"],["4 PILLARS","Core Domains"],[`${TOTAL_RESOURCES} RESOURCES`,"All In One Place"]].map(([v,l])=>(
              <div key={v} style={{borderLeft:"2px solid #00FFB2",paddingLeft:10}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#00FFB2"}}>{v}</div>
                <div style={{fontSize:9,color:"#4A5568",letterSpacing:2,textTransform:"uppercase"}}>{l}</div>
              </div>
            ))}
            {/* mini progress bar in header */}
            <div style={{marginLeft:"auto",textAlign:"right"}}>
              <div style={{fontSize:9,color:"#4A5568",letterSpacing:2,marginBottom:4}}>OVERALL PROGRESS</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{background:"#1A2030",height:6,width:120,borderRadius:3}}>
                  <div className="bar" style={{background:"linear-gradient(90deg,#00FFB2,#00FFB280)",height:"100%",width:`${overallPct}%`,borderRadius:3}}/>
                </div>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:"#00FFB2"}}>{overallPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{borderBottom:"1px solid #1A2030",padding:"0 28px"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          {[["roadmap","Roadmap"],["tracker","Tracker"],["skills","Survival Skills"],["dead","What Dies"]].map(([t,l])=>(
            <button key={t} className="tb" onClick={()=>setTab(t)} style={{color:tab===t?"#00FFB2":"#4A5568",padding:"14px 18px",fontSize:10,letterSpacing:3,textTransform:"uppercase",borderBottom:tab===t?"2px solid #00FFB2":"2px solid transparent",marginBottom:-1}}>
              {l}{t==="tracker"&&doneWeeks>0&&<span style={{marginLeft:6,background:"#00FFB220",color:"#00FFB2",fontSize:8,padding:"1px 5px",borderRadius:2}}>{doneWeeks}/{WEEKS.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"28px"}}>

        {/* ═══ ROADMAP ═══ */}
        {tab==="roadmap"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10,marginBottom:30}}>
              {PILLARS.map(p=>(
                <div key={p.id} style={{background:"#0D1117",border:`1px solid ${p.color}25`,borderTop:`3px solid ${p.color}`,padding:14,borderRadius:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                    <span style={{color:p.color,fontSize:15}}>{p.icon}</span>
                    <span style={{color:p.color,fontSize:9,letterSpacing:2}}>{p.id}</span>
                  </div>
                  <div style={{fontSize:11,fontWeight:500,color:"#E8EAF0",marginBottom:4,lineHeight:1.35}}>{p.label}</div>
                  <div style={{fontSize:10,color:"#4A5568",lineHeight:1.5}}>{p.why}</div>
                </div>
              ))}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {WEEKS.map(w=>{
                const isOn = openWeek===w.week;
                const st = tracker?.weekStatus[w.week]||WEEK_STATUS.NOT_STARTED;
                const sm = STATUS_META[st];
                const wProjects = w.projects.map((_,i)=>({key:`${w.week}-${i}`,done:tracker?.projects[`${w.week}-${i}`]||false}));
                const wDone = wProjects.filter(p=>p.done).length;
                const res = resFilter==="all" ? w.resources : w.resources.filter(r=>r.type===resFilter);
                return (
                  <div key={w.week}>
                    <div className={`wk${isOn?" on":""}`} onClick={()=>setOpenWeek(isOn?null:w.week)}
                      style={{background:"#0D1117",borderRadius:isOn?"4px 4px 0 0":4,padding:"16px 20px",borderLeft:`3px solid ${w.phaseColor}`}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:w.phaseColor,minWidth:22}}>W{w.week}</span>
                          <div>
                            <div style={{fontSize:12,fontWeight:500,color:"#E8EAF0"}}>{w.title}</div>
                            <div style={{fontSize:9,color:"#4A5568",letterSpacing:2,marginTop:2}}>{w.phase} · {w.hours}h · {w.resources.length} resources</div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <span style={{fontSize:10,color:sm.textColor}}>{sm.dot}</span>
                          <span style={{background:`${PILLAR_COLORS[w.pillar]}12`,color:PILLAR_COLORS[w.pillar],fontSize:8,letterSpacing:2,padding:"2px 7px",borderRadius:2}}>{w.pillar}</span>
                          {wDone>0&&<span style={{fontSize:9,color:"#00FFB2"}}>{wDone}/{w.projects.length}p</span>}
                          <span style={{color:"#4A5568",fontSize:10}}>{isOn?"▲":"▼"}</span>
                        </div>
                      </div>
                    </div>

                    {isOn&&(
                      <div style={{background:"#0A0E14",border:"1px solid #1A2030",borderTop:"none",borderRadius:"0 0 4px 4px"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,padding:"20px 20px 0"}}>
                          <div>
                            <div style={{fontSize:9,color:"#00FFB2",letterSpacing:3,marginBottom:9}}>WHAT YOU LEARN</div>
                            {w.skills.map((s,i)=>(
                              <div key={i} style={{display:"flex",gap:7,marginBottom:6,fontSize:11,color:"#A0A8B8",lineHeight:1.45}}>
                                <span style={{color:"#00FFB2",flexShrink:0}}>→</span><span>{s}</span>
                              </div>
                            ))}
                            <div style={{marginTop:12}}>
                              <div style={{fontSize:9,color:"#4A5568",letterSpacing:3,marginBottom:6}}>TOOLS</div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                                {w.tools.map(t=>(
                                  <span key={t} style={{background:"#1A2030",color:"#A0A8B8",fontSize:9,padding:"2px 7px",borderRadius:2,letterSpacing:1}}>{t}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style={{fontSize:9,color:"#FF6B35",letterSpacing:3,marginBottom:9}}>BUILD THESE PROJECTS</div>
                            {w.projects.map((p,i)=>{
                              const pKey=`${w.week}-${i}`;
                              const done=tracker?.projects[pKey]||false;
                              return (
                                <div key={i} style={{background:"#0D1117",border:"1px solid #1A2030",borderLeft:`3px solid ${p.hard?"#FF6B35":"#A855F7"}`,padding:"10px 13px",marginBottom:8,borderRadius:"0 4px 4px 0"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                                    <span onClick={e=>{e.stopPropagation();toggleProject(pKey);}} className="chk"
                                      style={{fontSize:13,color:done?"#00FFB2":"#2A3040",lineHeight:1}}>
                                      {done?"☑":"☐"}
                                    </span>
                                    <span style={{fontSize:11,fontWeight:500,color:done?"#4A5568":"#E8EAF0",textDecoration:done?"line-through":"none"}}>{p.name}</span>
                                    {p.hard&&<span style={{background:"#FF6B3520",color:"#FF6B35",fontSize:7,padding:"1px 5px",borderRadius:2,letterSpacing:1}}>HARD</span>}
                                  </div>
                                  <div style={{fontSize:10,color:"#4A5568",lineHeight:1.5}}>{p.desc}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Resources */}
                        <div style={{padding:"16px 20px 20px",borderTop:"1px solid #1A2030",marginTop:16}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:7}}>
                            <div style={{fontSize:9,color:"#FACC15",letterSpacing:3}}>◆ LEARNING MATERIALS ({w.resources.length})</div>
                            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                              {["all","docs","course","video","book","repo"].map(f=>(
                                <button key={f} className="fb" onClick={e=>{e.stopPropagation();setResFilter(f===resFilter?"all":f);}}
                                  style={{background:resFilter===f?"#FACC1518":"#0D1117",color:resFilter===f?"#FACC15":"#4A5568",border:`1px solid ${resFilter===f?"#FACC1540":"#1A2030"}`,fontSize:8,padding:"3px 8px",letterSpacing:1,textTransform:"uppercase"}}>
                                  {f==="all"?"ALL":RES_META[f]?.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:6}}>
                            {res.map((r,i)=>{
                              const m=RES_META[r.type];
                              return (
                                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="rl"
                                  style={{background:"#0D1117",border:`1px solid ${m.color}20`,borderLeft:`2px solid ${m.color}`,padding:"9px 12px",borderRadius:"0 4px 4px 0"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                                    <span style={{color:m.color,fontSize:8}}>{m.icon}</span>
                                    <span style={{fontSize:8,color:m.color,letterSpacing:2}}>{m.label}</span>
                                  </div>
                                  <div style={{fontSize:11,color:"#E8EAF0",marginBottom:2,lineHeight:1.35}}>{r.label}</div>
                                  <div style={{fontSize:9,color:"#4A5568",lineHeight:1.45}}>{r.note}</div>
                                </a>
                              );
                            })}
                          </div>
                          {resFilter!=="all"&&res.length===0&&(
                            <div style={{fontSize:10,color:"#4A5568",textAlign:"center",padding:16}}>
                              No {resFilter} resources this week. <span onClick={()=>setResFilter("all")} style={{color:"#00FFB2",cursor:"pointer"}}>Show all →</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ TRACKER ═══ */}
        {tab==="tracker"&&(
          <div>
            {/* Stats row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:28}}>
              {[
                {label:"WEEKS DONE",value:doneWeeks,total:WEEKS.length,color:"#00FFB2"},
                {label:"IN PROGRESS",value:inProgressWeeks,total:WEEKS.length,color:"#FF6B35"},
                {label:"PROJECTS DONE",value:doneProjects,total:totalProjects,color:"#A855F7"},
                {label:"HOURS BANKED",value:completedHours,total:TOTAL_HOURS,color:"#FACC15"},
              ].map(s=>(
                <div key={s.label} style={{background:"#0D1117",border:`1px solid ${s.color}25`,borderTop:`3px solid ${s.color}`,padding:"14px 16px",borderRadius:4}}>
                  <div style={{fontSize:9,color:"#4A5568",letterSpacing:3,marginBottom:6,textTransform:"uppercase"}}>{s.label}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:s.color}}>{s.value}</span>
                    <span style={{fontSize:10,color:"#4A5568"}}>/ {s.total}</span>
                  </div>
                  <div style={{background:"#1A2030",height:3,borderRadius:2,marginTop:8}}>
                    <div className="bar" style={{background:s.color,height:"100%",width:`${Math.round((s.value/s.total)*100)}%`,borderRadius:2}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall progress */}
            <div style={{background:"#0D1117",border:"1px solid #00FFB230",borderRadius:4,padding:"16px 20px",marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:9,color:"#00FFB2",letterSpacing:3}}>OVERALL COMPLETION</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#00FFB2"}}>{overallPct}%</div>
              </div>
              <div style={{background:"#1A2030",height:8,borderRadius:4}}>
                <div className="bar" style={{background:"linear-gradient(90deg,#00FFB2,#A855F7)",height:"100%",width:`${overallPct}%`,borderRadius:4}}/>
              </div>
              {tracker?.startDate&&(
                <div style={{fontSize:9,color:"#4A5568",marginTop:8}}>
                  Started: {new Date(tracker.startDate).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                  {tracker.startDate&&<span style={{marginLeft:12}}>Target: {new Date(new Date(tracker.startDate).getTime()+84*24*60*60*1000).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>}
                </div>
              )}
            </div>

            {/* Per-week tracker */}
            <div style={{fontSize:9,color:"#4A5568",letterSpacing:3,marginBottom:12}}>WEEK-BY-WEEK PROGRESS · click status to cycle</div>
            <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:24}}>
              {WEEKS.map(w=>{
                const st=tracker?.weekStatus[w.week]||WEEK_STATUS.NOT_STARTED;
                const sm=STATUS_META[st];
                const wProjects=w.projects.map((_,i)=>({key:`${w.week}-${i}`,name:_.name,done:tracker?.projects[`${w.week}-${i}`]||false,hard:_.hard}));
                const projDone=wProjects.filter(p=>p.done).length;
                const pct=Math.round((projDone/w.projects.length)*100);
                return (
                  <div key={w.week} style={{background:"#0D1117",border:"1px solid #1A2030",borderRadius:4,padding:"12px 16px",borderLeft:`3px solid ${w.phaseColor}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:w.phaseColor,minWidth:20}}>W{w.week}</span>
                        <div>
                          <div style={{fontSize:11,color:"#E8EAF0"}}>{w.title}</div>
                          <div style={{fontSize:9,color:"#4A5568",marginTop:2}}>{w.hours}h · {w.phase}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        {/* project checkboxes */}
                        <div style={{display:"flex",gap:5,alignItems:"center"}}>
                          {wProjects.map(p=>(
                            <span key={p.key} onClick={()=>toggleProject(p.key)} className="chk"
                              title={p.name}
                              style={{fontSize:14,color:p.done?"#00FFB2":"#2A3040"}}>
                              {p.done?"☑":"☐"}
                            </span>
                          ))}
                          <span style={{fontSize:9,color:"#4A5568"}}>{projDone}/{w.projects.length}</span>
                        </div>
                        {/* status toggle */}
                        <button className="sc" onClick={()=>cycleStatus(w.week)}
                          style={{background:sm.color,color:sm.textColor,fontSize:8,padding:"4px 10px",letterSpacing:2,textTransform:"uppercase"}}>
                          {sm.dot} {sm.label}
                        </button>
                      </div>
                    </div>
                    {/* progress bar for projects */}
                    {w.projects.length>0&&(
                      <div style={{marginTop:8,background:"#1A2030",height:2,borderRadius:1}}>
                        <div className="bar" style={{background:w.phaseColor,height:"100%",width:`${pct}%`,borderRadius:1}}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Projects checklist */}
            <div style={{fontSize:9,color:"#A855F7",letterSpacing:3,marginBottom:12}}>ALL PROJECTS CHECKLIST ({doneProjects}/{totalProjects} done)</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:6,marginBottom:28}}>
              {ALL_PROJECTS.map(p=>{
                const done=tracker?.projects[`${p.weekNum}-${p.projIdx}`]||false;
                return (
                  <div key={`${p.weekNum}-${p.projIdx}`} onClick={()=>toggleProject(`${p.weekNum}-${p.projIdx}`)} className="chk"
                    style={{background:done?"#0D1A12":"#0D1117",border:`1px solid ${done?"#00FFB230":"#1A2030"}`,borderLeft:`2px solid ${done?"#00FFB2":p.phaseColor}`,padding:"10px 14px",borderRadius:"0 4px 4px 0"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,color:done?"#00FFB2":"#2A3040"}}>{done?"☑":"☐"}</span>
                      <div>
                        <div style={{fontSize:11,color:done?"#4A5568":"#E8EAF0",textDecoration:done?"line-through":"none",lineHeight:1.3}}>{p.name}</div>
                        <div style={{fontSize:9,color:"#4A5568",marginTop:2}}>W{p.weekNum} · {p.phase}{p.hard?" · HARD":""}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reset */}
            <div style={{textAlign:"center",paddingTop:12,borderTop:"1px solid #1A2030"}}>
              <button onClick={()=>{if(confirm("Reset all progress? This cannot be undone."))resetTracker();}} className="fb"
                style={{background:"transparent",color:"#4A5568",border:"1px solid #1A2030",fontSize:9,padding:"8px 16px",letterSpacing:2}}>
                ↺ RESET TRACKER
              </button>
              <div style={{fontSize:9,color:"#2A3040",marginTop:8}}>Progress is saved automatically in your browser</div>
            </div>
          </div>
        )}

        {/* ═══ SKILLS ═══ */}
        {tab==="skills"&&(
          <div>
            <p style={{fontSize:11,color:"#4A5568",marginBottom:24,lineHeight:1.7}}>Skills that will make you irreplaceable. Demand score = difficulty to hire someone with this today (out of 10).</p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {SURVIVAL.map((s,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"center"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
                      <span style={{fontSize:12,color:"#E8EAF0"}}>{s.skill}</span>
                      <span style={{background:`${URGENCY_COLORS[s.urgency]}18`,color:URGENCY_COLORS[s.urgency],fontSize:7,padding:"2px 7px",letterSpacing:2,borderRadius:2}}>{s.urgency}</span>
                    </div>
                    <div style={{background:"#1A2030",height:3,borderRadius:2}}>
                      <div className="bar" style={{background:`linear-gradient(90deg,${URGENCY_COLORS[s.urgency]},${URGENCY_COLORS[s.urgency]}70)`,height:"100%",width:`${s.demand*10}%`,borderRadius:2}}/>
                    </div>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:URGENCY_COLORS[s.urgency],width:32,textAlign:"right"}}>{s.demand}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:40}}>
              <div style={{fontSize:9,color:"#A855F7",letterSpacing:3,marginBottom:16}}>YOUR UNFAIR ADVANTAGE</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  ["Infrastructure + AI = Rare","90% of ML engineers can't debug a pod. 90% of DevOps engineers can't build an agent. You will do both."],
                  ["Prod-Hardened Instincts","8 years of firefighting is your edge. AI models hallucinate. You'll know when infra output can't be trusted."],
                  ["The Automation Multiplier","You won't just deploy AI — you'll build agents that deploy AI. 10x your throughput."],
                  ["Portfolio > Certifications","14 projects from this plan outvalue any cert in 2025–2030."],
                ].map(([t,b])=>(
                  <div key={t} style={{background:"#0D1117",border:"1px solid #A855F725",padding:14,borderRadius:4}}>
                    <div style={{fontSize:11,fontWeight:500,color:"#A855F7",marginBottom:5}}>{t}</div>
                    <div style={{fontSize:10,color:"#4A5568",lineHeight:1.6}}>{b}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ DEAD ═══ */}
        {tab==="dead"&&(
          <div>
            <p style={{fontSize:11,color:"#4A5568",marginBottom:24,lineHeight:1.7}}>Skills and habits AI agents will automate away. Stop investing time here.</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:36}}>
              {DEAD.map((d,i)=>(
                <div key={i} className="di" style={{background:"#140808",border:"1px solid #FF444428",padding:"12px 15px",borderRadius:4,fontSize:12,color:"#A0A8B8"}}>{d}</div>
              ))}
            </div>
            <div style={{borderTop:"1px solid #1A2030",paddingTop:24}}>
              <div style={{fontSize:9,color:"#FACC15",letterSpacing:3,marginBottom:14}}>WHAT SURVIVES</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {[
                  ["Systems Thinking","Understanding WHY an architecture works. Agents can run playbooks, not judge tradeoffs."],
                  ["Incident Judgment","Knowing when to roll back vs. push forward. Context an LLM doesn't have."],
                  ["Security Intuition","Recognizing attack surfaces. AI agents need human review on sensitive changes."],
                  ["Cross-Team Communication","Translating infra complexity to product/exec. Still irreplaceably human."],
                  ["Architectural Decision Making","Choosing between Kafka vs SQS, Istio vs Linkerd. AI advises, you decide."],
                ].map(([s,r])=>(
                  <div key={s} style={{display:"flex",gap:12,background:"#0D1A12",border:"1px solid #FACC1528",padding:"12px 15px",borderRadius:4}}>
                    <span style={{color:"#FACC15",flexShrink:0}}>✓</span>
                    <div>
                      <span style={{fontSize:12,color:"#FACC15",marginRight:8}}>{s}</span>
                      <span style={{fontSize:10,color:"#4A5568"}}>{r}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{borderTop:"1px solid #1A2030",padding:"16px 28px",display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
        {["Wk1-4: Foundation","Wk5-6: AI Agents","Wk7-8: Complex Arch","Wk9-10: GPU Infra","Wk11-12: Observability + Capstone"].map((s,i)=>(
          <div key={i} style={{fontSize:9,color:"#4A5568",letterSpacing:1}}>
            <span style={{color:"#00FFB2",marginRight:5}}>◈</span>{s}
          </div>
        ))}
      </div>
    </div>
  );
}
