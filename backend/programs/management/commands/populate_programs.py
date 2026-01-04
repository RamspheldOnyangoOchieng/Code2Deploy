from django.core.management.base import BaseCommand
from programs.models import Program


class Command(BaseCommand):
    help = 'Populate the database with initial programs'

    def handle(self, *args, **kwargs):
        # Clear existing programs
        Program.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing programs'))

        programs_data = [
            {
                'title': 'Full-Stack Web Development',
                'description': 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to build complete web applications.',
                'image': 'https://readdy.ai/api/search-image?query=Modern%2520web%2520development%2520workspace%2520with%2520code%2520on%2520screen%252C%2520showing%2520HTML%252C%2520CSS%252C%2520and%2520JavaScript.%2520Clean%252C%2520professional%2520setup%2520with%2520a%2520minimalist%2520design.%2520The%2520image%2520has%2520a%2520blue-tinted%2520tech%2520aesthetic%2520that%2520matches%2520the%2520websites%2520color%2520scheme%252C%2520with%2520clean%2520lines%2520and%2520a%2520professional%2520look&width=400&height=225&seq=101&orientation=landscape',
                'duration': '12 Weeks',
                'level': 'Beginner',
                'technologies': 'HTML/CSS, JavaScript, React, Node.js',
                'mode': 'Online',
                'sessions_per_week': 3,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'Basic computer knowledge and internet access',
                'modules': 'HTML Fundamentals, CSS Styling, JavaScript Basics, React Framework, Node.js Backend, MongoDB Database, Full-Stack Project'
            },
            {
                'title': 'Data Science & Analytics',
                'description': 'Master data analysis, visualization, and machine learning with Python and its powerful libraries.',
                'image': 'https://readdy.ai/api/search-image?query=Data%2520science%2520visualization%2520with%2520charts%252C%2520graphs%252C%2520and%2520Python%2520code%2520on%2520screen.%2520The%2520image%2520shows%2520data%2520analysis%2520in%2520progress%2520with%2520colorful%2520data%2520visualizations.%2520Modern%252C%2520clean%2520workspace%2520with%2520a%2520professional%2520look.%2520The%2520color%2520scheme%2520includes%2520blues%2520that%2520match%2520the%2520websites%2520color%2520palette&width=400&height=225&seq=102&orientation=landscape',
                'duration': '16 Weeks',
                'level': 'Intermediate',
                'technologies': 'Python, Pandas, NumPy, Scikit-learn',
                'mode': 'Online',
                'sessions_per_week': 4,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'Basic Python programming knowledge',
                'modules': 'Python for Data Science, Pandas Data Manipulation, NumPy Arrays, Data Visualization, Statistical Analysis, Machine Learning Basics, Real-World Projects'
            },
            {
                'title': 'Mobile App Development',
                'description': 'Build cross-platform mobile applications using React Native for iOS and Android devices.',
                'image': 'https://readdy.ai/api/search-image?query=Mobile%2520app%2520development%2520workspace%2520with%2520smartphone%2520mockups%2520and%2520React%2520Native%2520code%2520on%2520screen.%2520The%2520image%2520shows%2520a%2520professional%2520development%2520environment%2520with%2520mobile%2520UI%2520designs%2520visible.%2520Clean%252C%2520modern%2520aesthetic%2520with%2520blue%2520tones%2520that%2520match%2520the%2520websites%2520color%2520scheme&width=400&height=225&seq=103&orientation=landscape',
                'duration': '14 Weeks',
                'level': 'Intermediate',
                'technologies': 'JavaScript, React Native, Redux, Firebase',
                'mode': 'Hybrid',
                'sessions_per_week': 3,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'JavaScript fundamentals and basic React knowledge',
                'modules': 'React Native Basics, Mobile UI Components, Navigation, State Management with Redux, Firebase Integration, Push Notifications, App Deployment'
            },
            {
                'title': 'AI & Machine Learning',
                'description': 'Dive deep into artificial intelligence, neural networks, and advanced machine learning algorithms.',
                'image': 'https://readdy.ai/api/search-image?query=Artificial%2520intelligence%2520and%2520machine%2520learning%2520workspace%2520with%2520neural%2520network%2520visualizations%2520and%2520Python%2520code.%2520The%2520image%2520shows%2520AI%2520models%2520being%2520trained%2520with%2520data%2520flowing%2520through%2520network%2520nodes.%2520Professional%252C%2520clean%2520aesthetic%2520with%2520blue%2520tones&width=400&height=225&seq=104&orientation=landscape',
                'duration': '20 Weeks',
                'level': 'Advanced',
                'technologies': 'Python, TensorFlow, PyTorch, Keras',
                'mode': 'Online',
                'sessions_per_week': 4,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'Strong Python skills, mathematics background (linear algebra, calculus), and basic machine learning knowledge',
                'modules': 'Machine Learning Fundamentals, Neural Networks, Deep Learning, Convolutional Neural Networks, Recurrent Neural Networks, Natural Language Processing, Computer Vision, AI Ethics, Capstone Project'
            },
            {
                'title': 'Cloud Computing & DevOps',
                'description': 'Learn to deploy, scale, and manage applications in the cloud using AWS, Azure, and Google Cloud.',
                'image': 'https://readdy.ai/api/search-image?query=Cloud%2520computing%2520and%2520DevOps%2520workspace%2520showing%2520cloud%2520architecture%2520diagrams%2520and%2520terminal%2520with%2520deployment%2520scripts.%2520Professional%2520development%2520environment%2520with%2520multiple%2520screens%2520displaying%2520cloud%2520services.%2520Clean%252C%2520modern%2520aesthetic%2520with%2520blue%2520tones&width=400&height=225&seq=105&orientation=landscape',
                'duration': '16 Weeks',
                'level': 'Intermediate',
                'technologies': 'AWS, Docker, Kubernetes, CI/CD',
                'mode': 'Online',
                'sessions_per_week': 3,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'Basic Linux command line knowledge and programming experience',
                'modules': 'Cloud Computing Basics, AWS Services, Docker Containers, Kubernetes Orchestration, CI/CD Pipelines, Infrastructure as Code, Monitoring and Logging, Cloud Security'
            },
            {
                'title': 'Blockchain Development',
                'description': 'Develop decentralized applications and smart contracts on blockchain platforms like Ethereum.',
                'image': 'https://readdy.ai/api/search-image?query=Blockchain%2520development%2520workspace%2520with%2520code%2520editor%2520showing%2520smart%2520contract%2520development%2520and%2520blockchain%2520architecture%2520diagrams.%2520Modern%2520tech%2520environment%2520with%2520visualizations%2520of%2520blockchain%2520nodes%2520and%2520connections.%2520Professional%252C%2520clean%2520aesthetic%2520with%2520blue%2520tones&width=400&height=225&seq=106&orientation=landscape',
                'duration': '14 Weeks',
                'level': 'Advanced',
                'technologies': 'Solidity, Web3.js, Ethereum, Smart Contracts',
                'mode': 'Online',
                'sessions_per_week': 3,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'JavaScript programming and understanding of blockchain concepts',
                'modules': 'Blockchain Fundamentals, Ethereum Architecture, Solidity Programming, Smart Contract Development, Web3.js Integration, DApp Development, Security Best Practices, Token Standards'
            },
            {
                'title': 'UI/UX Design',
                'description': 'Master the principles of user interface and experience design to create beautiful, functional applications.',
                'image': 'https://readdy.ai/api/search-image?query=UI%2520UX%2520design%2520workspace%2520with%2520design%2520software%2520open%2520showing%2520wireframes%2520and%2520prototypes.%2520The%2520scene%2520includes%2520color%2520palettes%252C%2520user%2520flow%2520diagrams%252C%2520and%2520mobile%2520app%2520interface%2520designs.%2520Clean%252C%2520modern%2520aesthetic%2520with%2520blue%2520tones%2520that%2520match%2520the%2520websites%2520color%2520scheme&width=400&height=225&seq=107&orientation=landscape',
                'duration': '10 Weeks',
                'level': 'Beginner',
                'technologies': 'Figma, Adobe XD, Sketch, Prototyping',
                'mode': 'Hybrid',
                'sessions_per_week': 2,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'No prior design experience required, just creativity and passion',
                'modules': 'Design Principles, User Research, Wireframing, Prototyping, Visual Design, Interaction Design, Usability Testing, Portfolio Development'
            },
            {
                'title': 'Cybersecurity Fundamentals',
                'description': 'Learn to identify vulnerabilities, protect systems, and respond to security incidents.',
                'image': 'https://readdy.ai/api/search-image?query=Cybersecurity%2520workspace%2520with%2520multiple%2520screens%2520showing%2520security%2520monitoring%252C%2520code%2520analysis%252C%2520and%2520network%2520traffic.%2520Professional%2520security%2520operations%2520center%2520environment%2520with%2520data%2520visualizations%2520and%2520security%2520tools.%2520Clean%252C%2520modern%2520aesthetic%2520with%2520blue%2520tones&width=400&height=225&seq=108&orientation=landscape',
                'duration': '12 Weeks',
                'level': 'Intermediate',
                'technologies': 'Network Security, Ethical Hacking, Cryptography, Security Analysis',
                'mode': 'Online',
                'sessions_per_week': 3,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'Basic networking knowledge and Linux familiarity',
                'modules': 'Security Fundamentals, Network Security, Ethical Hacking Basics, Vulnerability Assessment, Penetration Testing, Cryptography, Incident Response, Security Tools'
            },
            {
                'title': 'Game Development',
                'description': 'Create interactive games using modern game engines and programming techniques.',
                'image': 'https://readdy.ai/api/search-image?query=Game%2520development%2520workspace%2520with%2520game%2520engine%2520interface%2520open%2520showing%25203D%2520models%252C%2520level%2520design%252C%2520and%2520game%2520code.%2520Professional%2520development%2520environment%2520with%2520game%2520assets%2520and%2520testing%2520screens.%2520Clean%252C%2520modern%2520aesthetic%2520with%2520blue%2520tones&width=400&height=225&seq=109&orientation=landscape',
                'duration': '16 Weeks',
                'level': 'Intermediate',
                'technologies': 'Unity, C#, 3D Modeling, Game Design',
                'mode': 'Hybrid',
                'sessions_per_week': 3,
                'has_certification': True,
                'scholarship_available': True,
                'prerequisites': 'Basic programming knowledge (preferably C# or similar)',
                'modules': 'Unity Basics, C# Programming for Games, 2D Game Development, 3D Game Development, Game Physics, Character Animation, Sound and Music, Game Publishing'
            }
        ]

        created_count = 0
        for program_data in programs_data:
            program = Program.objects.create(**program_data)
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'Created: {program.title}'))

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {created_count} programs!'))
