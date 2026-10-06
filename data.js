// Central Portfolio Data Configuration for Anant Joshi
// Easily update projects, skills, and personal information here.

const PORTFOLIO_DATA = {
  personal: {
    name: "Anant Joshi",
    role: "AI/ML Engineer & Data Analyst",
    degree: "Final-Year B.Tech in Computer Science and Engineering",
    specialization: "Data Science Specialization",
    status: "Graduating 2027 • Open to Full-Time & Engineering Roles",
    location: "India",
    email: "anantajjoshi@gmail.com",
    github: "https://github.com/Cypheraj12",
    linkedin: "https://linkedin.com/in/anant-joshi-52a6ab2a7/",
    resumeUrl: "Anant_Joshi_Resume.pdf",
    bio: "I like taking a dataset, breaking it down, finding what matters, and turning it into something that actually works. My work sits across data analysis, machine learning, and AI application development.\n\nMost of my projects are built with Python and tools like Scikit-learn, XGBoost, Pandas, FastAPI, and Streamlit—moving from raw data and models to usable applications.",
    photo: "anant_photo.jpg"
  },

  projects: [
    {
      id: "deepfake-detection",
      title: "Deepfake Detection Web App",
      category: "ml",
      categoryLabel: "Computer Vision & ML",
      year: "2026",
      tag: "MobileNetV2 • OpenCV",
      description: "A real-time deepfake media detection system designed to analyze video frames and subtle synthetic artifacts. Built on a fine-tuned MobileNetV2 architecture with OpenCV preprocessing to detect facial anomalies and manipulated features accurately.",
      role: "Lead Developer (Model Architecture & Web App)",
      highlights: [
        "95% classification accuracy on standardized synthetic benchmark datasets",
        "35% latency improvement achieved through optimized frame batching",
        "40% reduction in false-positive classifications on edge-case lighting"
      ],
      stack: ["Python", "TensorFlow", "MobileNetV2", "OpenCV", "NumPy"],
      githubUrl: "https://github.com/Cypheraj12/Deep_fake_detection_using_deep_learning",
      liveUrl: null
    },
    {
      id: "youtube-fetcher-api",
      title: "Scalable YouTube Video Fetcher API",
      category: "backend",
      categoryLabel: "Backend & Systems",
      year: "2026",
      tag: "FastAPI • MongoDB",
      description: "An asynchronous high-throughput REST service that continuously queries the YouTube Data API v3 for predefined search queries and persists structured video metadata. Engineered with automated API key rotation to handle quota exhaustion without downtime.",
      role: "Backend Engineer",
      highlights: [
        "50% latency drop on recurring queries using indexed MongoDB compound keys",
        "Automated multi-key rotation ensuring zero-downtime during quota caps",
        "Built-in asynchronous task execution via Asyncio background workers"
      ],
      stack: ["Python", "FastAPI", "MongoDB", "Asyncio", "Motor", "Uvicorn"],
      githubUrl: "https://github.com/Cypheraj12/youtube-video-fetcher",
      liveUrl: null
    },
    {
      id: "heart-disease-predictor",
      title: "Heart Disease ML Risk Predictor",
      category: "ml",
      categoryLabel: "Healthcare ML & Analytics",
      year: "2026",
      tag: "Scikit-Learn • Streamlit",
      description: "An interactive clinical risk evaluation platform trained on the UCI Heart Disease dataset. Compares multiple classification models (Random Forest, Logistic Regression, Support Vector Machines) to provide calibrated probability scores for patient risk factors.",
      role: "ML & Data Analyst",
      highlights: [
        "Comparative evaluation across ensemble classifiers with hyperparameter tuning",
        "Interactive Streamlit interface with real-time feature impact visualization",
        "Rigorous cross-validation preventing data leakage on clinical metrics"
      ],
      stack: ["Python", "Scikit-Learn", "Streamlit", "Pandas", "Matplotlib"],
      githubUrl: "https://github.com/Cypheraj12/Heart_disease-prediction",
      liveUrl: null
    },
    {
      id: "api-latency-forecasting",
      title: "Predictive API Latency Spikes Forecasting",
      category: "analytics",
      categoryLabel: "Time-Series ML",
      year: "2026",
      tag: "LSTM • XGBoost",
      description: "A time-series forecasting pipeline built to monitor system telemetry and predict API latency spikes (p95 and p99 percentiles) 5 to 15 minutes before they occur, giving engineering teams proactive lead time for auto-scaling.",
      role: "ML Engineer",
      highlights: [
        "Predicts p95 latency spikes with 5–15 minute predictive window",
        "Hybrid approach combining recurrent LSTM sequences with gradient-boosted trees",
        "Packaged into containerized microservice ready for pipeline integration"
      ],
      stack: ["Python", "PyTorch / LSTM", "XGBoost", "FastAPI", "Docker", "Pandas"],
      githubUrl: "https://github.com/Cypheraj12",
      liveUrl: null
    },
    {
      id: "laptop-price-eda",
      title: "Laptop Price Analysis & Valuation",
      category: "analytics",
      categoryLabel: "Data Analytics & EDA",
      year: "2025",
      tag: "EDA • Regression",
      description: "Comprehensive exploratory data analysis and predictive regression model evaluating how hardware specifications (processor tiers, GPU architecture, display metrics, RAM configurations) dictate market retail pricing.",
      role: "Data Analyst",
      highlights: [
        "End-to-end data cleansing, categorical encoding, and feature correlation analysis",
        "Multi-variable regression models benchmarked using RMSE and R² metrics",
        "Clear visualization plots detailing price elasticity across hardware tiers"
      ],
      stack: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Seaborn", "Matplotlib"],
      githubUrl: "https://github.com/Cypheraj12/laptop_price-analysis-and-prediction",
      liveUrl: null
    }
  ],

  skills: [
    {
      category: "Languages",
      items: ["Python", "SQL", "HTML5", "CSS3"]
    },
    {
      category: "AI & Machine Learning",
      items: ["TensorFlow", "PyTorch", "Scikit-Learn", "OpenCV", "MobileNetV2", "LSTM Networks", "XGBoost"]
    },
    {
      category: "Data Analytics & Modeling",
      items: ["Pandas", "NumPy", "Streamlit", "Exploratory Data Analysis (EDA)", "Feature Engineering", "Data Cleaning"]
    },
    {
      category: "Backend & Databases",
      items: ["FastAPI", "Flask", "MongoDB", "RESTful APIs", "Asyncio", "Database Indexing"]
    },
    {
      category: "Tools & Development",
      items: ["Git", "GitHub", "Docker", "Jupyter Notebooks", "VS Code", "Postman"]
    }
  ],

  contact: {
    email: "anantajjoshi@gmail.com",
    formAction: "https://formsubmit.co/anantajjoshi@gmail.com",
    channels: [
      {
        name: "Email",
        value: "anantajjoshi@gmail.com",
        href: "mailto:anantajjoshi@gmail.com",
        icon: "envelope"
      },
      {
        name: "LinkedIn",
        value: "linkedin.com/in/anant-joshi-52a6ab2a7",
        href: "https://linkedin.com/in/anant-joshi-52a6ab2a7/",
        icon: "linkedin"
      },
      {
        name: "GitHub",
        value: "github.com/Cypheraj12",
        href: "https://github.com/Cypheraj12",
        icon: "github"
      }
    ]
  }
};

// Export for module or vanilla script usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
