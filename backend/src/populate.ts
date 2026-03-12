import { Collection, MongoClient, type Db } from "mongodb";

let db:Db

interface Comment {
  writtenBy: string;
  content: string;
}

export interface blogsT {
  name: string;
  comments: Comment[];
  likes: number;
  blogTitle: string;
  blogDescription: string[];
}

const ex_blogs: blogsT[] = [
  {
    name: "ai-future-2023",
    blogTitle: "The Future of Artificial Intelligence: A Comprehensive Guide",
    blogDescription: [
      "Artificial Intelligence (AI) is no longer a concept of the future; it's here, and it's transforming industries at an unprecedented pace. From self-driving cars to virtual assistants, AI is reshaping the way we live and work. In this blog post, we'll explore the latest advancements in AI, including machine learning, natural language processing, and robotics.",
      "We'll also delve into the ethical implications of AI and discuss how businesses can leverage this technology to gain a competitive edge. By the end of this post, you'll have a comprehensive understanding of the future of AI and its potential impact on society. The rapid evolution of AI is not just a technological revolution but a societal one, and it's essential to understand its implications.",
      "As AI continues to advance, it's crucial to consider the ethical and societal implications. Issues such as job displacement, privacy concerns, and the potential for AI to be used for malicious purposes are all important considerations. By addressing these issues proactively, we can ensure that AI is developed and used in a responsible and ethical manner.",
      "The future of AI is bright, and the possibilities are endless. From personalized medicine to smart cities, AI has the potential to solve some of the world's most pressing problems. By staying informed and engaged, we can all play a role in shaping the future of AI and ensuring that it benefits society as a whole."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "time-management-2023",
    blogTitle: "10 Powerful Tips for Effective Time Management in the Digital Age",
    blogDescription: [
      "In today's fast-paced digital world, effective time management is more important than ever. With the constant influx of information and the rise of remote work, it's easy to feel overwhelmed and struggle to stay organized. In this blog post, we'll share 10 powerful tips for effective time management that you can implement today.",
      "From prioritization techniques to the use of productivity tools, we'll cover everything you need to know to create a more efficient and fulfilling daily routine. Whether you're a student, a professional, or a stay-at-home parent, these tips will help you make the most of your time and achieve your goals. Time management is not just about getting more done in less time; it's about creating a balanced and fulfilling life.",
      "One of the key tips for effective time management is to prioritize your tasks. By focusing on the most important tasks first, you can ensure that you're making the most of your time and energy. Additionally, using productivity tools such as calendars, to-do lists, and time-tracking apps can help you stay organized and on track.",
      "Another important tip is to set realistic goals and deadlines. By setting achievable goals and breaking them down into smaller tasks, you can create a sense of accomplishment and motivation. Additionally, taking regular breaks and practicing self-care can help you maintain your energy levels and productivity throughout the day."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "mindfulness-benefits-2023",
    blogTitle: "The Science-Backed Benefits of Mindfulness Meditation: Improving Mental Health and Well-Being",
    blogDescription: [
      "Mindfulness meditation has been gaining popularity in recent years, and for good reason. Research has shown that mindfulness can have a profound impact on mental health and overall well-being. In this blog post, we'll explore the science-backed benefits of mindfulness meditation, including reduced stress, anxiety, and depression.",
      "We'll also discuss different meditation techniques and provide tips for incorporating mindfulness into your daily life. Whether you're a beginner or an experienced meditator, this post will help you understand the power of mindfulness and how it can improve your life. Mindfulness is not just about sitting in silence and meditating; it's about being present and aware in all aspects of your life.",
      "One of the key benefits of mindfulness meditation is its ability to reduce stress and anxiety. By practicing mindfulness, you can train your brain to focus on the present moment and let go of worries about the past or future. This can lead to a significant reduction in stress and anxiety levels, improving your overall mental health and well-being.",
      "Additionally, mindfulness meditation has been shown to have a positive impact on physical health. Studies have shown that mindfulness can help lower blood pressure, improve immune function, and even reduce the risk of chronic diseases such as heart disease and diabetes. By incorporating mindfulness into your daily routine, you can improve your physical health and well-being."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "react-hooks-guide-2023",
    blogTitle: "Getting Started with React Hooks: A Beginner's Guide to Building Dynamic Web Applications",
    blogDescription: [
      "React Hooks have revolutionized the way we build web applications with React. In this beginner's guide, we'll cover the basics of React Hooks, including useState, useEffect, and useContext. You'll learn how to create custom hooks and manage state in your applications.",
      "We'll also discuss the benefits of using Hooks and how they can simplify your code and improve performance. By the end of this guide, you'll be ready to start building your own dynamic web applications with React Hooks. React Hooks provide a more straightforward and intuitive way to manage state and side effects in your applications, making it easier to build complex and dynamic web applications.",
      "One of the key benefits of React Hooks is their ability to simplify your code. By using Hooks, you can eliminate the need for class components and complex lifecycle methods, making your code more concise and easier to understand. Additionally, Hooks allow you to reuse stateful logic between components, making it easier to share functionality across your application.",
      "Another benefit of React Hooks is their ability to improve performance. By using Hooks, you can optimize your application by avoiding unnecessary re-renders and improving the efficiency of your code. Additionally, Hooks allow you to manage state more efficiently, reducing the amount of memory and processing power required by your application."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "climate-biodiversity-2023",
    blogTitle: "The Environmental Impact of Climate Change on Biodiversity: Conservation Efforts and Solutions",
    blogDescription: [
      "Climate change is one of the most pressing environmental issues of our time, and its impact on biodiversity is profound. In this blog post, we'll explore the environmental impact of climate change on ecosystems, including habitat loss, species extinction, and ecosystem disruption.",
      "We'll also discuss the various conservation efforts being undertaken to protect endangered species and preserve natural habitats. Additionally, we'll provide practical solutions and individual actions that can help mitigate the effects of climate change and promote environmental sustainability. Climate change is not just an environmental issue; it's a global challenge that requires collective action and commitment.",
      "One of the key impacts of climate change on biodiversity is habitat loss. As temperatures rise and weather patterns change, many species are losing their homes and struggling to adapt. This can lead to a decline in population numbers and, in some cases, species extinction. Conservation efforts are crucial in protecting endangered species and preserving natural habitats.",
      "Individual actions can also play a significant role in mitigating the effects of climate change. From reducing your carbon footprint to supporting sustainable practices, there are many ways to make a positive impact on the environment. By working together, we can create a more sustainable and resilient future for all."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "personal-brand-2023",
    blogTitle: "Building a Strong Personal Brand Online: Strategies for Standout in the Digital World",
    blogDescription: [
      "In today's digital age, having a strong personal brand is essential for success. Whether you're a professional, a business owner, or an individual looking to make a name for yourself, building a strong personal brand can open up new opportunities and help you stand out in a crowded digital landscape. In this blog post, we'll cover essential strategies for building a strong personal brand, including defining your unique value proposition, creating compelling content, and leveraging social media.",
      "We'll also discuss how to establish your online presence, engage with your audience, and build a loyal following. By implementing these strategies, you'll be well on your way to creating a memorable and impactful personal brand that sets you apart from the competition. A strong personal brand is not just about having a professional online presence; it's about telling a compelling story and connecting with your audience on a deeper level.",
      "One of the key strategies for building a strong personal brand is defining your unique value proposition. By identifying what makes you unique and valuable, you can create a clear and compelling message that resonates with your audience. Additionally, creating compelling content that showcases your expertise and personality can help you stand out and attract a loyal following.",
      "Leveraging social media is another essential strategy for building a strong personal brand. By consistently sharing valuable content and engaging with your audience, you can build a strong online presence and establish yourself as a thought leader in your industry. By implementing these strategies and staying true to your unique voice and values, you can create a personal brand that truly represents you and resonates with your audience."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "internet-history-2023",
    blogTitle: "A Journey Through the History of the Internet: From Its Early Days to the Present",
    blogDescription: [
      "The internet has come a long way since its inception in the 1960s. From the early days of ARPANET to the development of the World Wide Web in the 1990s, the internet has transformed the way we communicate, work, and entertain ourselves. In this blog post, we'll take a journey through the history of the internet, exploring the key milestones and technological advancements that have shaped the digital landscape we know today.",
      "We'll also discuss the future of the internet and the potential impact of emerging technologies such as the Internet of Things and quantum computing. The history of the internet is a fascinating story of innovation, collaboration, and technological advancement. From the early days of ARPANET to the development of the World Wide Web, each milestone has played a crucial role in shaping the internet as we know it today.",
      "One of the key milestones in the history of the internet is the development of the World Wide Web. Invented by Tim Berners-Lee in the late 1980s, the World Wide Web revolutionized the way we access and share information online. With the development of web browsers and search engines, the internet became more accessible and user-friendly, paving the way for the digital age we live in today.",
      "Looking ahead, the future of the internet is filled with exciting possibilities. From the Internet of Things to quantum computing, emerging technologies are poised to transform the way we live and work. By staying informed and engaged, we can all play a role in shaping the future of the internet and ensuring that it continues to benefit society as a whole."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "exercise-benefits-2023",
    blogTitle: "The Physical and Mental Health Benefits of Regular Exercise: A Comprehensive Guide",
    blogDescription: [
      "Regular exercise is essential for maintaining good physical and mental health. In this comprehensive guide, we'll explore the various types of exercise, including cardiovascular, strength training, and flexibility exercises. We'll also discuss the health benefits of regular exercise, such as improved cardiovascular health, increased muscle strength, and enhanced mental well-being.",
      "Additionally, we'll provide tips for creating an effective exercise routine and staying motivated to stay active. Whether you're a beginner or an experienced exerciser, this guide will help you understand the importance of regular exercise and how it can improve your overall health and well-being. Regular exercise is not just about losing weight or getting in shape; it's about improving your overall health and well-being.",
      "One of the key benefits of regular exercise is improved cardiovascular health. By engaging in cardiovascular exercises such as running, cycling, or swimming, you can strengthen your heart and improve your overall cardiovascular health. Additionally, regular exercise can help lower your risk of chronic diseases such as heart disease, stroke, and type 2 diabetes.",
      "Another benefit of regular exercise is increased muscle strength and endurance. By engaging in strength training exercises such as weightlifting or resistance training, you can build and maintain strong muscles, improve your posture, and enhance your overall physical performance. Additionally, regular exercise can help improve your flexibility and range of motion, reducing the risk of injuries and improving your overall quality of life."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "machine-learning-intro-2023",
    blogTitle: "Introduction to Machine Learning: Basics and Applications in Various Industries",
    blogDescription: [
      "Machine learning is a rapidly growing field that has the potential to revolutionize industries such as healthcare, finance, and retail. In this blog post, we'll provide an introduction to machine learning, covering the fundamental concepts of supervised and unsupervised learning, as well as the different types of machine learning algorithms.",
      "We'll also explore the various applications of machine learning in different industries and discuss how businesses can leverage this technology to gain a competitive edge. By the end of this post, you'll have a solid understanding of the basics of machine learning and its potential impact on the future of business. Machine learning is not just a technological advancement; it's a transformative force that is reshaping industries and changing the way we live and work.",
      "One of the key concepts in machine learning is supervised learning. In supervised learning, algorithms are trained on labeled data, allowing them to make predictions or classifications based on the input data. This type of learning is commonly used in applications such as image recognition, natural language processing, and predictive analytics.",
      "Another key concept in machine learning is unsupervised learning. In unsupervised learning, algorithms are trained on unlabeled data, allowing them to identify patterns and relationships within the data. This type of learning is commonly used in applications such as clustering, anomaly detection, and dimensionality reduction. By understanding the basics of machine learning and its various applications, you can gain a competitive edge in your industry and drive innovation and growth."
    ],
    comments: [],
    likes: 0
  },
  {
    name: "mental-health-awareness-2023",
    blogTitle: "The Importance of Mental Health Awareness: Promoting a Positive Mindset and Well-Being",
    blogDescription: [
      "Mental health awareness is a critical issue that affects individuals, families, and communities. In this blog post, we'll explore the various aspects of mental health, including common mental health challenges and coping strategies. We'll also discuss the importance of mental health awareness and how to raise awareness within your community.",
      "Additionally, we'll provide information on the various mental health resources and support services available to help you maintain a positive mindset and overall well-being. By promoting mental health awareness, we can create a more supportive and understanding society that prioritizes the mental health of all individuals. Mental health is not just about the absence of mental illness; it's about thriving and living a fulfilling life.",
      "One of the key aspects of mental health is emotional well-being. Emotional well-being refers to the ability to manage and express emotions in a healthy and constructive manner. By practicing self-awareness, self-regulation, and healthy relationships, you can improve your emotional well-being and overall mental health.",
      "Another important aspect of mental health is social well-being. Social well-being refers to the ability to form and maintain healthy relationships, communicate effectively, and participate in your community. By building strong social connections, practicing active listening, and engaging in meaningful activities, you can improve your social well-being and overall mental health."
    ],
    comments: [],
    likes: 0
  }
];

// export default blogs;

const MONGODB_URI = "mongodb://localhost:27017"; // Update with your MongoDB URI
const DB_NAME = "MERN"; // Your database name
let coll : Collection<blogsT>

async function cnnct(){
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db =  client.db(DB_NAME);    
    coll = db.collection<blogsT>('blogs');
    const res = await coll.insertMany(ex_blogs)
    console.log(res)
}

cnnct()
