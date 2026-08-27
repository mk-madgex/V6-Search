window.SEARCH_DATA = {
  locations: [
    { name: "New York, NY", aliases: ["new york", "nyc"], lat: 40.7128, lon: -74.006 },
    { name: "Boston, MA", aliases: ["boston"], lat: 42.3601, lon: -71.0589 },
    { name: "San Francisco, CA", aliases: ["san francisco", "sf"], lat: 37.7749, lon: -122.4194 },
    { name: "Detroit, MI", aliases: ["detroit"], lat: 42.3314, lon: -83.0458 },
    { name: "Chicago, IL", aliases: ["chicago"], lat: 41.8781, lon: -87.6298 },
    { name: "Philadelphia, PA", aliases: ["philadelphia", "philly"], lat: 39.9526, lon: -75.1652 },
    { name: "Seattle, WA", aliases: ["seattle"], lat: 47.6062, lon: -122.3321 },
    { name: "Austin, TX", aliases: ["austin"], lat: 30.2672, lon: -97.7431 }
  ],
  facets: [
    { key: "sector", label: "Sector" },
    { key: "jobseekerType", label: "Jobseeker type" },
    { key: "contractType", label: "Contract type" },
    { key: "jobTitle", label: "Job title" },
    { key: "hours", label: "Hours" },
    { key: "organisationType", label: "Organisation type" }
  ],
  jobs: [
    {
      id: 1, title: "Senior Environmental Scientist", company: "The Nature Conservancy",
      location: "New York, NY", lat: 40.7128, lon: -74.006, salary: "$85,000–$100,000",
      summary: "Lead field studies, habitat assessments and evidence-based conservation projects across the region.",
      sector: "Environmental science", locationGroup: "New York", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Scientist", hours: "Full time", organisationType: "Charity",
      remote: false, postedDays: 2, badge: "Top job"
    },
    {
      id: 2, title: "Research Assistant", company: "Darnelle University",
      location: "New York, NY", lat: 40.725, lon: -73.994, salary: "$45,000–$60,000",
      summary: "Support clinical research, prepare study materials and collaborate with a multidisciplinary team.",
      sector: "Healthcare", locationGroup: "New York", jobseekerType: "Early career",
      contractType: "Fixed term", jobTitle: "Research", hours: "Full time", organisationType: "University",
      remote: false, postedDays: 2, badge: "New"
    },
    {
      id: 3, title: "Medical Laboratory Scientist Expert — Toxicology", company: "The Nature Conservancy",
      location: "New York, NY", lat: 40.748, lon: -73.9857, salary: "$75,000–$92,000",
      summary: "Deliver specialist toxicology testing, quality control and technical guidance to laboratory colleagues.",
      sector: "Healthcare", locationGroup: "New York", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Scientist", hours: "Full time", organisationType: "Hospital",
      remote: false, postedDays: 3, badge: ""
    },
    {
      id: 4, title: "Research Study Assistant — Neurology", company: "Boston Medical Research",
      location: "Boston, MA", lat: 42.3601, lon: -71.0589, salary: "$48,500–$56,000",
      summary: "Coordinate participant visits and maintain accurate records for a long-term neurology research study.",
      sector: "Healthcare", locationGroup: "Boston", jobseekerType: "Early career",
      contractType: "Fixed term", jobTitle: "Research", hours: "Full time", organisationType: "Hospital",
      remote: false, postedDays: 2, badge: "New"
    },
    {
      id: 5, title: "Data Analyst II — Marketing & Analytics", company: "London Research Group",
      location: "Remote", lat: 40.7128, lon: -74.006, salary: "$70,000–$85,000",
      summary: "Turn campaign and audience data into clear recommendations using dashboards and statistical analysis.",
      sector: "Technology", locationGroup: "Remote", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Data", hours: "Part time", organisationType: "Private sector",
      remote: true, postedDays: 7, badge: ""
    },
    {
      id: 6, title: "Software Engineer III — Research Platforms", company: "San Francisco Labs",
      location: "San Francisco, CA", lat: 37.7749, lon: -122.4194, salary: "$110,000–$130,000",
      summary: "Build accessible research tooling and reliable APIs for teams working on environmental discovery.",
      sector: "Technology", locationGroup: "San Francisco", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Engineering", hours: "Full time", organisationType: "Private sector",
      remote: true, postedDays: 3, badge: ""
    },
    {
      id: 7, title: "Ecology Field Officer", company: "Great Lakes Conservation",
      location: "Detroit, MI", lat: 42.3314, lon: -83.0458, salary: "$58,000–$68,000",
      summary: "Survey wetlands, engage local partners and produce reports that guide regional restoration work.",
      sector: "Environmental science", locationGroup: "Detroit", jobseekerType: "Early career",
      contractType: "Fixed term", jobTitle: "Scientist", hours: "Full time", organisationType: "Charity",
      remote: false, postedDays: 1, badge: "New"
    },
    {
      id: 8, title: "Clinical Data Coordinator", company: "Chicago Health Network",
      location: "Chicago, IL", lat: 41.8781, lon: -87.6298, salary: "$62,000–$74,000",
      summary: "Validate clinical datasets and work with investigators to resolve data quality issues.",
      sector: "Healthcare", locationGroup: "Chicago", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Data", hours: "Full time", organisationType: "Hospital",
      remote: true, postedDays: 4, badge: ""
    },
    {
      id: 9, title: "Lecturer in Conservation Biology", company: "Philadelphia State University",
      location: "Philadelphia, PA", lat: 39.9526, lon: -75.1652, salary: "$72,000–$88,000",
      summary: "Teach conservation biology, supervise student research and contribute to an active ecology programme.",
      sector: "Education", locationGroup: "Philadelphia", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Teaching", hours: "Full time", organisationType: "University",
      remote: false, postedDays: 5, badge: ""
    },
    {
      id: 10, title: "Junior Front-end Developer", company: "Civic Science Studio",
      location: "Boston, MA", lat: 42.347, lon: -71.082, salary: "$65,000–$78,000",
      summary: "Create inclusive interfaces for public-interest science products with a supportive product team.",
      sector: "Technology", locationGroup: "Boston", jobseekerType: "Early career",
      contractType: "Permanent", jobTitle: "Engineering", hours: "Full time", organisationType: "Private sector",
      remote: true, postedDays: 1, badge: "New"
    },
    {
      id: 11, title: "Marine Research Fellow", company: "Pacific Ocean Institute",
      location: "Seattle, WA", lat: 47.6062, lon: -122.3321, salary: "$67,000–$79,000",
      summary: "Develop models of coastal ecosystems and publish findings with an international research team.",
      sector: "Environmental science", locationGroup: "Seattle", jobseekerType: "Experienced",
      contractType: "Fixed term", jobTitle: "Research", hours: "Full time", organisationType: "University",
      remote: false, postedDays: 6, badge: ""
    },
    {
      id: 12, title: "Bioinformatics Engineer", company: "Austin Genomics",
      location: "Austin, TX", lat: 30.2672, lon: -97.7431, salary: "$98,000–$118,000",
      summary: "Design reproducible genomics pipelines and make complex analyses available to clinical researchers.",
      sector: "Technology", locationGroup: "Austin", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Engineering", hours: "Full time", organisationType: "Private sector",
      remote: true, postedDays: 8, badge: ""
    },
    {
      id: 13, title: "Community Health Researcher", company: "Harbor Health Foundation",
      location: "Boston, MA", lat: 42.373, lon: -71.1097, salary: "$60,000–$72,000",
      summary: "Partner with community groups to evaluate health programmes and share accessible findings.",
      sector: "Healthcare", locationGroup: "Boston", jobseekerType: "Early career",
      contractType: "Fixed term", jobTitle: "Research", hours: "Part time", organisationType: "Charity",
      remote: false, postedDays: 3, badge: ""
    },
    {
      id: 14, title: "Environmental Policy Analyst", company: "Clean Air Alliance",
      location: "New York, NY", lat: 40.7357, lon: -74.1724, salary: "$76,000–$90,000",
      summary: "Analyse environmental policy and translate technical evidence into practical recommendations.",
      sector: "Environmental science", locationGroup: "New York", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Data", hours: "Full time", organisationType: "Charity",
      remote: true, postedDays: 9, badge: ""
    },
    {
      id: 15, title: "Science Learning Designer", company: "Open Learning Lab",
      location: "Remote", lat: 41.8781, lon: -87.6298, salary: "$68,000–$82,000",
      summary: "Design engaging online learning experiences that help adult learners explore scientific ideas.",
      sector: "Education", locationGroup: "Remote", jobseekerType: "Experienced",
      contractType: "Permanent", jobTitle: "Teaching", hours: "Part time", organisationType: "Private sector",
      remote: true, postedDays: 2, badge: "New"
    },
    {
      id: 16, title: "Laboratory Assistant — Microbiology", company: "Detroit Diagnostics",
      location: "Detroit, MI", lat: 42.356, lon: -83.071, salary: "$42,000–$50,000",
      summary: "Prepare samples, maintain equipment and support daily quality checks in a busy microbiology lab.",
      sector: "Healthcare", locationGroup: "Detroit", jobseekerType: "Early career",
      contractType: "Permanent", jobTitle: "Scientist", hours: "Full time", organisationType: "Hospital",
      remote: false, postedDays: 1, badge: "New"
    },
    {
      id: 17, title: "Part-time Statistics Tutor", company: "New York Learning Centre",
      location: "New York, NY", lat: 40.7306, lon: -73.9352, salary: "$38–$48 per hour",
      summary: "Help undergraduate learners build confidence in statistics through small-group teaching.",
      sector: "Education", locationGroup: "New York", jobseekerType: "Early career",
      contractType: "Fixed term", jobTitle: "Teaching", hours: "Part time", organisationType: "University",
      remote: false, postedDays: 5, badge: ""
    },
    {
      id: 18, title: "Machine Learning Research Scientist", company: "Emergent AI Institute",
      location: "San Francisco, CA", lat: 37.789, lon: -122.401, salary: "$125,000–$150,000",
      summary: "Investigate responsible machine-learning methods and publish open, reproducible research.",
      sector: "Technology", locationGroup: "San Francisco", jobseekerType: "Experienced",
      contractType: "Fixed term", jobTitle: "Scientist", hours: "Full time", organisationType: "Private sector",
      remote: true, postedDays: 10, badge: "Top job"
    }
  ]
};
