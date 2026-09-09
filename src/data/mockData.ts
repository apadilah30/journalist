import { Paper, Collection, EmergingTopic, ReferenceItem } from '../types';

export const mockCollections: Collection[] = [
  { id: 'all', name: 'All Papers', icon: 'folder', count: 184 },
  { id: 'reading', name: 'Currently Reading', icon: 'book-open', count: 6 },
  { id: 'thesis', name: 'Thesis: Efficient LLM Inference', icon: 'graduation-cap', count: 48, isProject: true },
  { id: 'grant', name: 'Grant Proposal: NSF AI Frontier...', icon: 'file-text', count: 29 },
  { id: 'unread', name: 'Unread Queue', icon: 'hourglass', count: 14 },
  { id: 'archive', name: 'Archive / Published Works', icon: 'archive', count: 32 },
];

export const mockTags = [
  '# transformers',
  '# quantization',
  '# speculative-decoding',
  '# benchmarks',
  '# review-needed',
];

export const mockPapers: Paper[] = [
  {
    id: 'paper-fa2',
    key: '@dao2023flashattention2',
    title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning',
    authors: [
      { name: 'Tri Dao', affiliation: 'Department of Computer Science, Stanford University', superscript: '1,2*', isCorresponding: true },
      { name: 'Daniel Fu', affiliation: 'Department of Computer Science, Stanford University', superscript: '1' },
      { name: 'Christopher Ré', affiliation: 'Department of Computer Science, Stanford University', superscript: '1' },
    ],
    authorsSummary: 'T. Dao (Stanford University)',
    year: 2023,
    venue: "ICLR '24 Oral",
    venueFull: 'International Conference on Learning Representations (ICLR 2024 Spotlight & Oral)',
    presentationType: 'ICLR 2024 ORAL PRESENTATION',
    doi: '10.48550/arXiv.2307.08691',
    arxivId: 'arXiv:2307.08691 [cs.LG]',
    corpusId: '259954082',
    subject: 'cs.LG · cs.AR · cs.PF',
    license: 'Apache-2.0 Open Source',
    openAccess: true,
    hasPdf: true,
    pdfSize: '1.8 MB',
    citations: 1842,
    influentialCitations: 312,
    citationVelocity: 84,
    quarterGrowth: 184,
    referencesCount: 58,
    altmetricScore: 420,
    githubStars: '16.2k',
    githubRepo: 'Dao-AILab/flash-attention',
    reproducibilityScore: 9.9,
    abstract:
      'Scaling sequence length is central to contemporary frontier language and multi-modal models, enabling extensive context reasoning, document-level summarization, and extended code generation. However, standard self-attention mechanisms scale quadratically with sequence length O(N²) in both computation and memory IO. While FlashAttention mitigated memory bandwidth limitations through SRAM tiling and avoiding quadratic memory read/writes from high-bandwidth HBM, it was still limited by occupancy and work distribution on modern GPU architectures.\n\nIn this paper, we propose FlashAttention-2: addressing these architectural bottlenecks by: (1) tweaking the online softmax algorithm to reduce non-matmul FLOPs; (2) parallelizing the attention computation over the sequence length dimension instead of solely batch and head counts, thereby dramatically improving GPU thread occupancy when head counts are low; and (3) partitioning work within each thread block to minimize thread communication and intra-block synchronization. On NVIDIA A100 SXM4 GPUs, FlashAttention-2 yields a 2x speedup over FlashAttention-1, reaching up to 230 TFLOPs/s (73% of peak). In end-to-end training of models such as GPT and LLaMA, we observe up to 2.8x wall-clock speedups.',
    notesSummary: '"Crucial for chapter 4 baselin..."',
    highlightsCount: 3,
    notesCount: 1,
    readStatus: 'read',
    isStarred: true,
    collectionIds: ['all', 'thesis'],
    tags: ['# transformers', '# benchmarks', '# quantization'],
    notesMarkdown: `### Core Contribution & Chapter 4 Integration:
- Key difference from v1: eliminates non-matmul FLOPs by rescheduling softmax scaling.
- Directly addresses memory-bandwidth bottlenecks on NVIDIA Hopper
- Integrates directly into Chapter 3 synthesis for memory-bound operators.`,
    extractedHighlights: [
      {
        id: 'hl-1',
        page: 3,
        section: 'Section 2.2',
        col: 'p. 3, col 2',
        quote: 'FlashAttention-2 yields 2x speedup over FlashAttention-1, reaching up to 73% of theoretical maximum FLOPs/s on A100 GPUs.',
      },
      {
        id: 'hl-2',
        page: 6,
        section: 'Work Partitioning',
        col: 'p. 6, col 1',
        quote: 'We parallelize over the sequence length dimension instead of batch and head dimensions alone, yielding high occupancy even when batch size is 1.',
      },
      {
        id: 'hl-3',
        page: 8,
        section: 'Warp-Level Parallelism',
        col: 'p. 8, col 2',
        quote: 'By scheduling outer loops across Q matrix chunks while broadcasting K and V, shared memory synchronization barriers are cut by 40%.',
      },
    ],
    bibtex: `@inproceedings{dao2023flashattention2,
  title     = {FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning},
  author    = {Dao, Tri},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2024},
  doi       = {10.48550/arxiv.2307.08691},
  url       = {https://arxiv.org/abs/2307.08691}
}`,
    apa: 'Dao, T. (2024). FlashAttention-2: Faster attention with better parallelism and work partitioning. In International Conference on Learning Representations (ICLR).',
    ris: `TY  - CONF
TI  - FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning
AU  - Dao, Tri
JO  - International Conference on Learning Representations (ICLR)
PY  - 2024
DO  - 10.48550/arxiv.2307.08691
UR  - https://arxiv.org/abs/2307.08691
ER  -`,
    endnote: `%0 Conference Proceedings
%T FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning
%A Dao, Tri
%B International Conference on Learning Representations
%D 2024
%R 10.48550/arxiv.2307.08691`,
    ieee: 'T. Dao, "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning," in Proc. ICLR, 2024, doi: 10.48550/arxiv.2307.08691.',
  },
  {
    id: 'paper-paged',
    key: '@kwon2023pagedattention',
    title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
    authors: [
      { name: 'Woosuk Kwon', affiliation: 'UC Berkeley' },
      { name: 'Zhuohan Li', affiliation: 'UC Berkeley' },
      { name: 'Siyuan Zhuang', affiliation: 'UC Berkeley' },
      { name: 'Ion Stoica', affiliation: 'UC Berkeley' },
    ],
    authorsSummary: 'W. Kwon et al. (UC Berkeley)',
    year: 2023,
    venue: "SOSP '23",
    venueFull: 'Proceedings of the 29th ACM Symposium on Operating Systems Principles',
    doi: '10.1145/3600006.3613165',
    corpusId: '261738291',
    subject: 'cs.DC · cs.OS',
    openAccess: true,
    hasPdf: true,
    pdfSize: '1.4 MB',
    citations: 986,
    influentialCitations: 194,
    citationVelocity: 62,
    referencesCount: 42,
    altmetricScore: 310,
    githubStars: '32.1k',
    githubRepo: 'vllm-project/vllm',
    abstract:
      'High throughput serving of Large Language Models (LLMs) requires batching requests together. However, existing systems struggle because the Key-Value (KV) cache memory is huge, dynamic, and unpredictable. We propose PagedAttention, an attention algorithm inspired by the classic virtual memory and paging in OS.',
    notesSummary: '"Paged memory handles KV..."',
    highlightsCount: 5,
    notesCount: 2,
    readStatus: 'read',
    isStarred: true,
    collectionIds: ['all', 'thesis', 'reading'],
    tags: ['# transformers', '# quantization'],
    notesMarkdown: `### PagedAttention Notes:
- Divides KV cache into blocks (pages) to eliminate internal and external memory fragmentation.
- Near-zero memory waste (under 4% overhead).
- Foundation for vLLM high-throughput engine.`,
    bibtex: `@inproceedings{kwon2023pagedattention,
  title     = {Efficient Memory Management for Large Language Model Serving with PagedAttention},
  author    = {Kwon, Woosuk and Li, Zhuohan and Zhuang, Siyuan and Sheng, Ying and Zheng, Lianmin and Yu, Cody Hao and Gonzalez, Joseph E. and Zhang, Hao and Stoica, Ion},
  booktitle = {Proceedings of the 29th ACM Symposium on Operating Systems Principles (SOSP)},
  year      = {2023},
  doi       = {10.1145/3600006.3613165}
}`,
    apa: 'Kwon, W., Li, Z., Zhuang, S., et al. (2023). Efficient memory management for large language model serving with PagedAttention. In SOSP.',
    ris: `TY  - CONF
TI  - Efficient Memory Management for Large Language Model Serving with PagedAttention
AU  - Kwon, Woosuk
JO  - SOSP
PY  - 2023
ER  -`,
    endnote: `%0 Conference Proceedings
%T Efficient Memory Management for Large Language Model Serving with PagedAttention
%A Kwon, Woosuk
%D 2023`,
    ieee: 'W. Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention," in Proc. SOSP, 2023.',
  },
  {
    id: 'paper-sinks',
    key: '@xiao2024attentionsinks',
    title: 'Efficient Streaming Language Models with Attention Sinks',
    authors: [
      { name: 'Guangxuan Xiao', affiliation: 'MIT HAN Lab' },
      { name: 'Yuandong Tian', affiliation: 'Meta AI' },
      { name: 'Beidi Chen', affiliation: 'Carnegie Mellon' },
      { name: 'Song Han', affiliation: 'MIT' },
    ],
    authorsSummary: 'G. Xiao et al. (MIT HAN Lab)',
    year: 2024,
    venue: "ICLR '24",
    venueFull: 'International Conference on Learning Representations (ICLR 2024)',
    doi: '10.48550/arXiv.2309.17453',
    subject: 'cs.CL · cs.AI',
    openAccess: true,
    hasPdf: true,
    citations: 364,
    influentialCitations: 78,
    citationVelocity: 45,
    referencesCount: 39,
    abstract:
      'Serving LLMs in multi-round dialogue without restarting faces significant slowdowns as prompt lengths grow. We observe the "attention sink" phenomenon: retaining initial token KV representations preserves stability even during infinite context streaming.',
    notesSummary: '"Attention sinks prevent..."',
    highlightsCount: 2,
    notesCount: 1,
    readStatus: 'reading',
    isStarred: false,
    collectionIds: ['all', 'thesis', 'reading'],
    tags: ['# speculative-decoding', '# transformers'],
    notesMarkdown: `### StreamingLLM & Attention Sinks:
- First 4 initial tokens act as an anchor sink absorbing excess softmax attention probabilities.
- Combines sink tokens with rolling KV cache window for stable 4M+ token inference.`,
    bibtex: `@inproceedings{xiao2024attentionsinks,
  title     = {Efficient Streaming Language Models with Attention Sinks},
  author    = {Xiao, Guangxuan and Tian, Yuandong and Chen, Beidi and Han, Song},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2024}
}`,
    apa: 'Xiao, G., Tian, Y., Chen, B., & Han, S. (2024). Efficient streaming language models with attention sinks. In ICLR.',
    ris: `TY  - CONF
TI  - Efficient Streaming Language Models with Attention Sinks
AU  - Xiao, Guangxuan
PY  - 2024
ER  -`,
    endnote: `%0 Conference Proceedings
%T Efficient Streaming Language Models with Attention Sinks
%A Xiao, Guangxuan
%D 2024`,
    ieee: 'G. Xiao, Y. Tian, B. Chen, and S. Han, "Efficient Streaming Language Models with Attention Sinks," in Proc. ICLR, 2024.',
  },
  {
    id: 'paper-duo',
    key: '@zhang2024duoattention',
    title: 'DuoAttention: Efficient Long-Context LLM Inference with Retrieval Heads',
    authors: [
      { name: 'Junxian Zhang', affiliation: 'MIT & Stanford' },
      { name: 'Tri Dao', affiliation: 'Stanford' },
      { name: 'Song Han', affiliation: 'MIT' },
    ],
    authorsSummary: 'J. Zhang et al. (MIT & Stanford)',
    year: 2024,
    venue: "ICML '24 Oral",
    venueFull: 'International Conference on Machine Learning (ICML 2024 Oral)',
    doi: '10.48550/arXiv.2410.10819',
    subject: 'cs.LG · cs.AI',
    openAccess: true,
    hasPdf: true,
    citations: 89,
    influentialCitations: 19,
    citationVelocity: 28,
    referencesCount: 46,
    abstract:
      'Long-context LLMs require massive KV cache memory. We demonstrate that only a fraction of attention heads ("Retrieval Heads") require full long-context KV history, while "Streaming Heads" only require short local context.',
    notesSummary: 'Needs detailed evaluation on...',
    highlightsCount: 0,
    notesCount: 0,
    readStatus: 'unread',
    isStarred: true,
    collectionIds: ['all', 'thesis', 'unread'],
    tags: ['# review-needed', '# transformers'],
    notesMarkdown: `### Reading Queue Agenda:
- Evaluate retrieval head threshold criteria on needle-in-a-haystack benchmarks.
- Compare memory savings with FlashDecoding++.`,
    bibtex: `@inproceedings{zhang2024duoattention,
  title     = {DuoAttention: Efficient Long-Context LLM Inference with Retrieval Heads},
  author    = {Zhang, Junxian and Dao, Tri and Han, Song},
  booktitle = {International Conference on Machine Learning (ICML)},
  year      = {2024}
}`,
    apa: 'Zhang, J., Dao, T., & Han, S. (2024). DuoAttention: Efficient long-context LLM inference with retrieval heads. In ICML.',
    ris: `TY  - CONF
TI  - DuoAttention: Efficient Long-Context LLM Inference with Retrieval Heads
AU  - Zhang, Junxian
PY  - 2024
ER  -`,
    endnote: `%0 Conference Proceedings
%T DuoAttention: Efficient Long-Context LLM Inference with Retrieval Heads
%A Zhang, Junxian
%D 2024`,
    ieee: 'J. Zhang, T. Dao, and S. Han, "DuoAttention: Efficient Long-Context LLM Inference with Retrieval Heads," in Proc. ICML, 2024.',
  },
  {
    id: 'paper-fa1',
    key: '@dao2022flashattention',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: [
      { name: 'Tri Dao', affiliation: 'Stanford University' },
      { name: 'Daniel Y. Fu', affiliation: 'Stanford University' },
      { name: 'Stefano Ermon', affiliation: 'Stanford University' },
      { name: 'Atri Rudra', affiliation: 'University at Buffalo' },
      { name: 'Christopher Ré', affiliation: 'Stanford University' },
    ],
    authorsSummary: 'Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Ré · Stanford University, University at Buffalo',
    year: 2022,
    venue: 'NeurIPS 2022 Oral',
    venueFull: 'Advances in Neural Information Processing Systems 35 (NeurIPS 2022)',
    doi: '10.48550/arXiv.2205.14135',
    arxivId: 'arXiv:2205.14135',
    corpusId: '249150148',
    openAccess: true,
    hasPdf: true,
    pdfSize: '1.4 MB',
    citations: 2410,
    influentialCitations: 540,
    citationVelocity: 184,
    referencesCount: 48,
    altmetricScore: 482,
    githubStars: '14.2k',
    reproducibilityScore: 9.8,
    abstract:
      'Exact attention algorithm with IO-awareness utilizing tiling to prevent unnecessary GPU memory reads/writes between fast SRAM and slow HBM.',
    readStatus: 'read',
    isStarred: true,
    collectionIds: ['all', 'thesis', 'archive'],
    tags: ['# transformers', '# benchmarks'],
    bibtex: `@inproceedings{dao2022flashattention,
  title     = {FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness},
  author    = {Dao, Tri and Fu, Daniel Y. and Ermon, Stefano and Rudra, Atri and R{\\'e}, Christopher},
  booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
  year      = {2022}
}`,
    apa: 'Dao, T., Fu, D. Y., Ermon, S., Rudra, A., & Ré, C. (2022). FlashAttention: Fast and memory-efficient exact attention with IO-awareness. In NeurIPS.',
    ris: `TY  - CONF
TI  - FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness
AU  - Dao, Tri
PY  - 2022
ER  -`,
    endnote: `%0 Conference Proceedings
%T FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness
%A Dao, Tri
%D 2022`,
    ieee: 'T. Dao et al., "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness," in NeurIPS, 2022.',
  },
  {
    id: 'paper-longformer',
    key: '@beltagy2020longformer',
    title: 'Longformer: The Long-Document Transformer',
    authors: [
      { name: 'Iz Beltagy', affiliation: 'Allen Institute for Artificial Intelligence' },
      { name: 'Matthew E. Peters', affiliation: 'Allen Institute for Artificial Intelligence' },
      { name: 'Arman Cohan', affiliation: 'Allen Institute for Artificial Intelligence' },
    ],
    authorsSummary: 'Iz Beltagy, Matthew E. Peters, Arman Cohan · Allen Institute for Artificial Intelligence (AI2)',
    year: 2020,
    venue: 'arXiv:2004.05150',
    venueFull: 'arXiv Preprint 2004.05150',
    doi: '10.48550/arXiv.2004.05150',
    openAccess: true,
    hasPdf: true,
    pdfSize: '890 KB',
    citations: 3890,
    referencesCount: 52,
    abstract:
      'Transformer-based models are unable to process long sequences due to their self-attention operation scaling quadratically with sequence length. To address this limitation, we present Longformer with an attention mechanism that scales linearly with sequence length, making it easy to process documents of thousands of tokens or longer.',
    readStatus: 'read',
    isStarred: false,
    collectionIds: ['all', 'archive'],
    tags: ['# transformers'],
    bibtex: `@article{beltagy2020longformer,
  title   = {Longformer: The Long-Document Transformer},
  author  = {Beltagy, Iz and Peters, Matthew E. and Cohan, Arman},
  journal = {arXiv preprint arXiv:2004.05150},
  year    = {2020}
}`,
    apa: 'Beltagy, I., Peters, M. E., & Cohan, A. (2020). Longformer: The long-document transformer. arXiv preprint arXiv:2004.05150.',
    ris: `TY  - JOUR
TI  - Longformer: The Long-Document Transformer
AU  - Beltagy, Iz
PY  - 2020
ER  -`,
    endnote: `%0 Journal Article
%T Longformer: The Long-Document Transformer
%A Beltagy, Iz
%D 2020`,
    ieee: 'I. Beltagy, M. E. Peters, and A. Cohan, "Longformer: The Long-Document Transformer," arXiv preprint arXiv:2004.05150, 2020.',
  },
  {
    id: 'paper-survey',
    key: '@tay2022survey',
    title: 'Efficient Transformers: A Survey',
    authors: [
      { name: 'Yi Tay', affiliation: 'Google Research' },
      { name: 'Mostafa Dehghani', affiliation: 'Google Brain' },
      { name: 'Dara Bahri', affiliation: 'Google Research' },
      { name: 'Donald Metzler', affiliation: 'Google Research' },
    ],
    authorsSummary: 'Yi Tay, Mostafa Dehghani, Dara Bahri, Donald Metzler · Google Research, Google Brain',
    year: 2022,
    venue: 'ACM CSUR 2022 · Peer-Reviewed Q1',
    venueFull: 'ACM Computing Surveys (CSUR) Vol 55 Issue 6',
    doi: '10.1145/3530811',
    openAccess: false,
    hasPdf: true,
    pdfSize: '2.1 MB',
    citations: 1940,
    referencesCount: 164,
    abstract:
      'Transformer model architectures have garnered tremendous interest and success in natural language processing and computer vision. In this comprehensive taxonomy, we categorize scalable transformer paradigms into fixed patterns, learnable patterns, memory caching, low-rank approximations, and kernelized attention.',
    readStatus: 'read',
    isStarred: true,
    collectionIds: ['all', 'thesis', 'archive'],
    tags: ['# transformers', '# benchmarks'],
    bibtex: `@article{tay2022survey,
  title   = {Efficient Transformers: A Survey},
  author  = {Tay, Yi and Dehghani, Mostafa and Bahri, Dara and Metzler, Donald},
  journal = {ACM Computing Surveys},
  volume  = {55},
  number  = {6},
  pages   = {1--28},
  year    = {2022},
  doi     = {10.1145/3530811}
}`,
    apa: 'Tay, Y., Dehghani, M., Bahri, D., & Metzler, D. (2022). Efficient transformers: A survey. ACM Computing Surveys, 55(6), 1-28.',
    ris: `TY  - JOUR
TI  - Efficient Transformers: A Survey
AU  - Tay, Yi
JO  - ACM Computing Surveys
PY  - 2022
ER  -`,
    endnote: `%0 Journal Article
%T Efficient Transformers: A Survey
%A Tay, Yi
%D 2022`,
    ieee: 'Y. Tay, M. Dehghani, D. Bahri, and D. Metzler, "Efficient Transformers: A Survey," ACM Comput. Surv., vol. 55, no. 6, pp. 1–28, 2022.',
  },
];

export const mockEmergingTopics: EmergingTopic[] = [
  {
    id: 'topic-1',
    domain: 'Computer Science · AI',
    growth: '+28.4%',
    title: 'Mechanistic Interpretability in LLMs',
    description: 'Reverse-engineering neural networks into human-interpretable algorithms and sparse feature circuits.',
    momentum30d: '8.4k citations',
    keyResearchers: ['C. Olah', 'N. Nanda'],
    keyResearchersCount: 42,
    manuscriptsCount: '1,418 Manuscripts',
    trendPoints: [20, 24, 32, 40, 52, 68, 85, 95],
  },
  {
    id: 'topic-2',
    domain: 'Biology · Agrigenomics',
    growth: '+19.1%',
    title: 'CRISPR Gene Editing in Agriculture',
    description: 'Targeted prime-editing and Cas12a vectors engineered for drought-resistant crop genomes and photosynthesis optimization.',
    momentum30d: '12.1k citations',
    keyResearchers: ['J. Doudna', 'K. Gao'],
    keyResearchersCount: 68,
    manuscriptsCount: '3,892 Manuscripts',
    trendPoints: [30, 36, 42, 50, 60, 72, 84, 91],
  },
  {
    id: 'topic-3',
    domain: 'Physics · Quantum Info',
    growth: '+34.2%',
    title: 'Quantum Error Correction Codes',
    description: 'Surface codes and fault-tolerant neutral-atom arrays operating below physical fault thresholds with logical qubits.',
    momentum30d: '6.7k citations',
    keyResearchers: ['J. Preskill', 'D. Gottesman'],
    keyResearchersCount: 31,
    manuscriptsCount: '942 Manuscripts',
    trendPoints: [15, 18, 26, 38, 55, 70, 88, 100],
  },
  {
    id: 'topic-4',
    domain: 'Security · Cryptography',
    growth: '+22.0%',
    title: 'Post-Quantum Cryptography',
    description: 'Lattice-based digital signatures, ML-KEM standardization benchmarks, and enterprise hardware migration protocols.',
    momentum30d: '5.3k citations',
    keyResearchers: ['V. Lyubashevsky', 'P. Schwabe'],
    keyResearchersCount: 27,
    manuscriptsCount: '1,120 Manuscripts',
    trendPoints: [25, 29, 35, 44, 56, 68, 77, 88],
  },
];

export const mockReferences: ReferenceItem[] = [
  {
    id: 1,
    authorsYear: 'Vaswani et al., 2017',
    title: 'Attention Is All You Need',
    venue: 'NeurIPS · 112,410 Citations',
    citations: '112,410 Citations',
    doi: '10.48550/arXiv.1706.03762',
    role: 'Foundational Architecture',
  },
  {
    id: 2,
    authorsYear: 'Dao et al., 2022',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    venue: 'NeurIPS · 4,120 Citations',
    citations: '4,120 Citations',
    doi: '10.48550/arXiv.2205.14135',
    role: 'Direct Antecedent',
  },
  {
    id: 3,
    authorsYear: 'Milakov & Gimelshein, 2018',
    title: 'Online normalizer calculation for softmax',
    venue: 'arXiv · 482 Citations',
    citations: '482 Citations',
    doi: '10.48550/arXiv.1805.02867',
    role: 'Mathematical Foundation',
  },
  {
    id: 4,
    authorsYear: 'Rabe & Staats, 2021',
    title: 'Self-attention Does Not Need O(N^2) Memory',
    venue: 'arXiv · 320 Citations',
    citations: '320 Citations',
    doi: '10.48550/arXiv.2112.05682',
    role: 'Theoretical Precursor',
  },
  {
    id: 5,
    authorsYear: 'Ivanov et al., 2021',
    title: 'Data Movement Is All You Need: A Case Study on Optimizing Transformers',
    venue: 'SC21 · 295 Citations',
    citations: '295 Citations',
    doi: '10.1145/3458817.3476150',
    role: 'Hardware Profiling',
  },
];

export const benchmarkData = [
  { seqLen: '2,048', tflopsFA2: 195, speedupText: '+85% vs v1', pctOfPeak: 62 },
  { seqLen: '4,096', tflopsFA2: 218, speedupText: '+98% vs v1', pctOfPeak: 70 },
  { seqLen: '8,192', tflopsFA2: 228, speedupText: '73% Theoretical Peak', pctOfPeak: 73 },
  { seqLen: '16,384', tflopsFA2: 226, speedupText: '+105% vs v1', pctOfPeak: 72 },
];
