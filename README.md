# Shadab Alam - Professional Portfolio Website

A modern, responsive portfolio website showcasing professional experience, technical skills, and coding achievements with interactive features and beautiful animations.

## 🚀 Live Demo

[**View Portfolio**](https://sha1am.github.io/portfo1io/)

## ✨ Features

### 🎨 **Beautiful Design**
- Modern, clean interface with smooth animations
- Fully responsive design for all devices
- Professional typography and color scheme
- 3D floating effects and micro-interactions

### 📄 **Interactive Resume**
- **Hover Magnification**: Resume expands to 80% screen size on hover
- **Scrollable Modal**: Full resume content is scrollable in expanded view
- **Smooth Transitions**: Professional animations without flickering
- **PDF Download**: Direct access to downloadable resume

### 💻 **Dynamic Coding Profiles**
- **Real-time Stats**: Live problem counts from coding platforms
- **Animated Progress Bars**: Visual representation of coding achievements
- **Platform Integration**: 
  - LeetCode (182 problems solved)
  - CodeForces (153 problems solved)
  - Stratascratch (25 problems solved)
- **Official Logos**: Professional branding for each platform

### 🎯 **Key Components**
- **Hero Section**: Professional introduction with call-to-action
- **Experience Deck**: Showcase of professional experience
- **Skills Display**: Technical skills and proficiencies
- **Contact Section**: Easy ways to get in touch

## 🛠️ Technical Stack

### **Frontend**
- **React 18.3.1**: Modern component-based architecture
- **Webpack 5**: Optimized bundling and asset management
- **CSS3**: Advanced animations and responsive design
- **Babel**: Modern JavaScript transpilation

### **Build Tools**
- **Webpack Dev Server**: Hot module replacement
- **CSS Loader**: Optimized CSS processing
- **HTML Webpack Plugin**: Automatic HTML generation

### **Deployment**
- **GitHub Pages**: Free hosting with automatic deployment
- **GitHub Actions**: CI/CD pipeline for builds
- **Node.js 18**: Build environment

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── App.js                 # Main React application
│   │   └── global.css            # Global styles
│   ├── assets/
│   │   └── images/               # Portfolio assets
│   │       ├── profile-picture.png
│   │       ├── resume-preview.jpg
│   │       ├── Shadab_Alam_Resume.pdf
│   │       └── platform logos
│   ├── features/
│   │   └── portfolio/
│   │       ├── PortfolioPage.js  # Main portfolio page
│   │       ├── components/       # React components
│   │       ├── hooks/           # Custom React hooks
│   │       ├── services/        # API services
│   │       └── data/            # Portfolio data
│   └── shared/
│       └── utils/               # Utility functions
├── public/
├── .github/workflows/            # GitHub Actions
├── dist/                         # Production build
└── package.json
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18 or higher
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/sha1am/portfo1io.git
cd portfo1io/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### **Build for Production**

```bash
npm run build
```

The optimized files will be generated in the `dist/` folder.

## 🎨 Customization

### **Updating Profile Information**

Edit `src/features/portfolio/data/content.js`:

```javascript
export const personalInfo = {
  name: "Your Name",
  title: "Your Title",
  greeting: "Your greeting message",
  // ... other personal details
};
```

### **Updating Coding Stats**

The coding stats are fetched dynamically. To update manually:

```javascript
export const codingProfiles = [
  {
    platform: "LeetCode",
    problemsSolved: 182,
    profileUrl: "your-leetcode-profile",
    // ... other details
  },
  // ... other platforms
];
```

### **Modifying Resume**

Replace the resume files in `src/assets/images/`:
- `Shadab_Alam_Resume.pdf` - Full resume
- `resume-preview.jpg` - Resume preview image

## 🔧 Configuration

### **Webpack Configuration**

The webpack configuration is in `webpack.config.js`:
- Development server setup
- Asset optimization
- CSS processing
- Bundle optimization

### **GitHub Pages Deployment**

The project is configured for automatic deployment via GitHub Actions:
- Builds automatically on push to main branch
- Deploys to GitHub Pages
- Uses Node.js 18 environment

## 🎯 Key Features Implementation

### **Resume Hover Effect**
The resume uses CSS transforms and transitions for smooth magnification:

```css
.resume-page--center:hover {
  width: 80vw;
  max-height: 80vh;
  transform: translateX(-50%) translateY(-50%) scale(1);
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
  overflow-y: auto;
}
```

### **Dynamic Stats Fetching**
Real-time coding stats are fetched using custom hooks:

```javascript
const useCodingStats = () => {
  // Fetches stats from LeetCode, CodeForces, Stratascratch
  // Handles loading states and errors
  // Updates UI with live data
};
```

### **Responsive Design**
The portfolio uses modern CSS techniques:
- CSS Grid and Flexbox layouts
- Mobile-first responsive design
- Smooth animations and transitions

## 🌟 Performance Optimizations

- **Code Splitting**: Optimized bundle sizes
- **Image Optimization**: Compressed images with proper formats
- **CSS Minification**: Optimized stylesheets
- **Asset Caching**: Proper cache headers for static assets
- **Lazy Loading**: Images and components loaded as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Portfolio**: https://sha1am.github.io/portfo1io/
- **Email**: shadab171299@gmail.com
- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: https://github.com/sha1am

## 🙏 Acknowledgments

- React team for the amazing framework
- GitHub Pages for free hosting
- All coding platforms for the APIs and inspiration
- The open-source community for valuable tools and libraries

---

**Build by Shadab Alam**
