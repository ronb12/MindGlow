# Contributing to MindGlow

Thank you for your interest in contributing to MindGlow!

**A product of Bradley Virtual Solutions, LLC**

---

## 🤝 **How to Contribute**

### **Reporting Bugs**
- Use the GitHub issue tracker
- Follow the issue template
- Include screenshots if applicable
- Describe steps to reproduce

### **Suggesting Features**
- Open a GitHub issue
- Describe the feature in detail
- Explain the use case
- Consider implementation approach

### **Submitting Code**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly on multiple devices
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📋 **Development Guidelines**

### **Code Style**
- Use ES6+ JavaScript
- Follow existing code patterns
- Use meaningful variable names
- Comment complex logic
- Keep functions small and focused

### **File Organization**
```
js/
├── auth/          # Authentication modules
├── features/      # Feature modules
├── utils/         # Utility modules
└── data/          # Data files
```

### **Module Structure**
- One feature per file
- Export singleton instances
- Use ES6 imports/exports
- Keep modules under 200 lines

### **Testing**
- Test on desktop (Chrome, Firefox, Safari)
- Test on mobile (iOS Safari, Android Chrome)
- Test responsive design (320px to 1920px)
- Run automated tests: `npm test`
- Verify Firebase integration

---

## 🔧 **Local Development Setup**

### **Prerequisites**
- Node.js 16+ installed
- Firebase CLI installed
- Git installed

### **Setup Steps**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ronb12/MindGlow.git
   cd MindGlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local server:**
   ```bash
   npm start
   # or
   python3 -m http.server 8080
   ```

4. **Open in browser:**
   ```
   http://localhost:8080
   ```

---

## 🧪 **Testing**

### **Run Tests:**
```bash
# Run all tests
npm test

# Run feature tests
node tests/quick-test.js

# Run responsive tests
node tests/test-responsive-devices.js

# Run iOS touch tests
node tests/test-ios-touch.js
```

### **Manual Testing Checklist:**
- [ ] Create account and login
- [ ] Test all 51 features
- [ ] Check on mobile device
- [ ] Verify offline mode works
- [ ] Test background customization
- [ ] Check forgot password flow

---

## 📦 **Deployment**

### **Deploy to Firebase:**
```bash
# Deploy everything
firebase deploy --project mindglow-wellness

# Deploy hosting only
firebase deploy --only hosting --project mindglow-wellness

# Deploy database rules only
firebase deploy --only firestore --project mindglow-wellness
```

### **Using Automated Script:**
```bash
./deploy.sh
```

---

## 📝 **Commit Message Guidelines**

### **Format:**
```
<emoji> <type>: <subject>

<body>

<footer>
```

### **Types:**
- ✨ `feat:` New feature
- 🐛 `fix:` Bug fix
- 📝 `docs:` Documentation
- 💄 `style:` Formatting
- ♻️  `refactor:` Code restructuring
- 🧪 `test:` Tests
- 🔧 `chore:` Maintenance

### **Examples:**
```
✨ feat: Add forgot password feature
🐛 fix: Resolve background color display issue
📝 docs: Update README with PWA installation guide
```

---

## 🔒 **Security**

### **Never Commit:**
- ❌ Actual user passwords
- ❌ Private keys or secrets
- ❌ `.env` files with real values
- ❌ Personal data
- ❌ Database backups

### **Always:**
- ✅ Use `.env.example` for documentation
- ✅ Follow security rules guidelines
- ✅ Test authentication flows
- ✅ Validate user input
- ✅ Report security issues privately

---

## 📚 **Resources**

- [Project README](README.md)
- [Features Documentation](FEATURES.md)
- [Architecture Guide](MODULAR_ARCHITECTURE.md)
- [Security Documentation](SECURITY.md)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## ❓ **Questions?**

- Open a GitHub issue
- Check existing documentation
- Review code examples in `/tests`

---

## 📄 **License**

Copyright © 2025 Bradley Virtual Solutions, LLC. All rights reserved.

This is proprietary software. Contributions are welcome, but all rights remain with Bradley Virtual Solutions, LLC.

---

**Thank you for contributing to MindGlow!** 🙏

*Making wellness accessible to everyone* ✨

