#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from programs.models import Program

# Sample programs data matching the actual model fields
programs_data = [
    {
        'title': 'Full Stack Web Development Bootcamp',
        'description': 'Learn to build modern web applications from scratch. Master HTML, CSS, JavaScript, React, Node.js, and databases. Get hands-on experience with real-world projects.',
        'duration': '12 Weeks',
        'level': 'Intermediate',
        'technologies': 'HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, Git',
        'mode': 'Hybrid',
        'sessions_per_week': 4,
        'has_certification': True,
        'scholarship_available': True,
        'is_paid': False,
        'price': 0.00,
        'coupon': '%coupon',
        'prerequisites': 'Basic understanding of programming concepts',
        'modules': 'HTML & CSS Fundamentals, JavaScript Basics, React Framework, Backend with Node.js, Database Design, API Development, Deployment'
    },
    {
        'title': 'Python for Data Science',
        'description': 'Comprehensive course covering Python programming, data analysis with Pandas, NumPy, visualization, and machine learning basics. Perfect for aspiring data scientists.',
        'duration': '8 Weeks',
        'level': 'Beginner',
        'technologies': 'Python, Pandas, NumPy, Matplotlib, Scikit-learn, Jupyter',
        'mode': 'Online',
        'sessions_per_week': 3,
        'has_certification': True,
        'scholarship_available': True,
        'is_paid': False,
        'price': 0.00,
        'coupon': '%coupon',
        'prerequisites': 'None - suitable for beginners',
        'modules': 'Python Basics, Data Structures, Pandas & NumPy, Data Visualization, Statistics, Machine Learning Intro, Real Projects'
    },
    {
        'title': 'Mobile App Development with React Native',
        'description': 'Build cross-platform mobile applications for iOS and Android using React Native and Expo. Learn to create beautiful, performant mobile apps.',
        'duration': '10 Weeks',
        'level': 'Intermediate',
        'technologies': 'React Native, Expo, JavaScript, Redux, Firebase, API Integration',
        'mode': 'Online',
        'sessions_per_week': 3,
        'has_certification': True,
        'scholarship_available': False,
        'is_paid': True,
        'price': 99.99,
        'coupon': '%coupon',
        'prerequisites': 'JavaScript and React knowledge required',
        'modules': 'React Native Basics, Navigation, State Management, API Integration, Authentication, Deployment to App Stores'
    },
    {
        'title': 'Cloud Computing with AWS',
        'description': 'Master Amazon Web Services including EC2, S3, Lambda, RDS, and learn to deploy scalable, highly available applications in the cloud.',
        'duration': '6 Weeks',
        'level': 'Advanced',
        'technologies': 'AWS, EC2, S3, Lambda, RDS, CloudFormation, Docker, Kubernetes',
        'mode': 'On-site',
        'sessions_per_week': 2,
        'has_certification': True,
        'scholarship_available': False,
        'is_paid': True,
        'price': 149.99,
        'coupon': '%coupon',
        'prerequisites': 'Experience with web development and Linux',
        'modules': 'AWS Fundamentals, EC2 & Networking, S3 Storage, Serverless with Lambda, Database Services, DevOps & CI/CD'
    },
    {
        'title': 'UI/UX Design Fundamentals',
        'description': 'Learn user interface and user experience design principles, wireframing, prototyping with Figma. Create beautiful and user-friendly designs.',
        'duration': '6 Weeks',
        'level': 'Beginner',
        'technologies': 'Figma, Adobe XD, Sketch, InVision, User Research Tools',
        'mode': 'Hybrid',
        'sessions_per_week': 3,
        'has_certification': True,
        'scholarship_available': True,
        'is_paid': False,
        'price': 0.00,
        'coupon': '%coupon',
        'prerequisites': 'None - creative mindset helpful',
        'modules': 'Design Principles, User Research, Wireframing, Prototyping, Usability Testing, Design Systems, Portfolio Building'
    },
    {
        'title': 'Cybersecurity Essentials',
        'description': 'Learn to protect systems and networks from cyber threats. Cover ethical hacking, penetration testing, and security best practices.',
        'duration': '8 Weeks',
        'level': 'Intermediate',
        'technologies': 'Kali Linux, Wireshark, Metasploit, Nmap, Burp Suite, OWASP',
        'mode': 'Online',
        'sessions_per_week': 4,
        'has_certification': True,
        'scholarship_available': True,
        'is_paid': False,
        'price': 0.00,
        'coupon': '%coupon',
        'prerequisites': 'Basic networking and Linux knowledge',
        'modules': 'Security Fundamentals, Network Security, Web Security, Ethical Hacking, Penetration Testing, Security Tools, Incident Response'
    },
    {
        'title': 'DevOps Engineering Bootcamp',
        'description': 'Master DevOps practices including CI/CD, containerization, orchestration, and infrastructure as code. Become a DevOps engineer.',
        'duration': '10 Weeks',
        'level': 'Advanced',
        'technologies': 'Docker, Kubernetes, Jenkins, GitLab CI, Terraform, Ansible, AWS',
        'mode': 'Hybrid',
        'sessions_per_week': 4,
        'has_certification': True,
        'scholarship_available': False,
        'is_paid': True,
        'price': 199.99,
        'coupon': '%coupon',
        'prerequisites': 'Software development and Linux experience',
        'modules': 'DevOps Principles, Version Control, CI/CD Pipelines, Containerization, Kubernetes, Infrastructure as Code, Monitoring'
    },
    {
        'title': 'Artificial Intelligence & Machine Learning',
        'description': 'Deep dive into AI and ML algorithms, neural networks, deep learning with TensorFlow and PyTorch. Build intelligent systems.',
        'duration': '12 Weeks',
        'level': 'Advanced',
        'technologies': 'Python, TensorFlow, PyTorch, Keras, OpenCV, NLP Libraries',
        'mode': 'Online',
        'sessions_per_week': 3,
        'has_certification': True,
        'scholarship_available': True,
        'is_paid': False,
        'price': 0.00,
        'coupon': '%coupon',
        'prerequisites': 'Python, Mathematics, and Statistics knowledge',
        'modules': 'ML Fundamentals, Neural Networks, Deep Learning, Computer Vision, NLP, Reinforcement Learning, AI Projects'
    }
]

# Create programs
created_count = 0
existing_count = 0

for data in programs_data:
    program, created = Program.objects.get_or_create(
        title=data['title'],
        defaults=data
    )
    if created:
        created_count += 1
        print(f'[SUCCESS] Created: {program.title}')
    else:
        existing_count += 1
        print(f'[INFO] Already exists: {program.title}')

print(f'\nSummary:')
print(f'   Created: {created_count} programs')
print(f'   Already existed: {existing_count} programs')
print(f'   Total in database: {Program.objects.count()} programs')
