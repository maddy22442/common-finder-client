# Common Address Finder

A simple **dark-mode** React application that allows users to upload multiple text or JSON files and find common addresses among them.

## Features
- **File Upload**: Supports TXT and JSON files.
- **Dark Mode UI**: Beautiful and minimalistic dark-themed design.
- **Error Handling**: Alerts when less than two files are selected.
- **Processing Indicator**: Shows loading animation while processing files.
- **Rainbow Effect**: Displays results with a colorful gradient.
- **Downloadable Results**: Allows users to download the common addresses as a TXT file.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/common-address-finder.git
   cd common-address-finder
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
1. Select at least two files using the **Upload Files** button.
2. Click **Find Common Addresses** to process the files.
3. View results with a rainbow-colored display.
4. Download the results as a text file if needed.

## API Endpoint
The application expects a backend running at:
```
http://localhost:3000/api/find-common
```
The backend should accept a `POST` request with uploaded files and return JSON with:
```json
{
  "count": 5,
  "commonAddresses": ["Address 1", "Address 2"]
}
```

## Tech Stack
- **React** with TypeScript
- **TailwindCSS** for styling
- **Lucide Icons** for UI elements

## Contributing
Feel free to submit issues or pull requests to improve the project!

## License
MIT License

