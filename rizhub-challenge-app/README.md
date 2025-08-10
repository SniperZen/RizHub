# RizHub Challenge App

## Overview
RizHub Challenge App is a web application designed to dynamically display "kabanatas" (chapters) from a database. The application features pagination, allowing users to view 7 "kabanatas" per page, and implements a looping background for aesthetic appeal.

## Project Structure
```
rizhub-challenge-app
├── src
│   ├── pages
│   │   ├── index.tsx         # Main entry point for the application
│   │   └── kabanata.tsx      # Displays "kabanata" content with pagination
│   ├── components
│   │   ├── KabanataList.tsx   # Renders a list of "kabanatas"
│   │   └── KabanataItem.tsx   # Represents a single "kabanata" item
│   ├── styles
│   │   └── kabanata.module.css # CSS styles for "kabanata" components
│   └── types
│       └── kabanata.ts        # TypeScript types for "kabanata" data
├── public
│   └── backgrounds
│       └── background1.jpg    # Background image for "kabanata" pages
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd rizhub-challenge-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Usage
- Navigate to the main page to view the list of "kabanatas."
- Use pagination controls to browse through the "kabanatas."
- The application will loop the background image if there are more than 7 "kabanatas."

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.