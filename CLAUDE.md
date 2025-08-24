# CLAUDE.md - PowerBI Forge Viewer Visual with Element Coloring

## Project Overview

This project implements a PowerBI custom visual that embeds Autodesk Forge Viewer for displaying 3D BIM models with dynamic element coloring capabilities. The visual allows users to color individual model elements based on data from PowerBI reports.

## Development Environment

### Required Versions
- **Node.js**: v12.22.12 (use `nvm use 12`)
- **PowerBI Visual Tools**: v2.5.0
- **npm**: v6.14.16

### Development Commands
```bash
# Switch to correct Node version
nvm use 12

# Start development server
pbiviz start

# Build package
pbiviz package

# Create/install SSL certificates
pbiviz --create-cert
pbiviz --install-cert
```

### Development URLs
- **Development Server**: https://localhost:8080
- **Status Endpoint**: https://localhost:8080/assets/status
- **PowerBI Test Environment**: https://app.powerbi.com

## Chrome Dev Setup for Advanced Debugging

### Installation
1. **Download Chrome Dev**: Get it from https://www.google.com/intl/es_us/chrome/dev/
2. **Install**: Follow standard installation process for macOS

### Launch Command
```bash
# Launch Chrome Dev with remote debugging port
/Applications/Google\ Chrome\ Dev.app/Contents/MacOS/Google\ Chrome\ Dev --remote-debugging-port=9222
```

### Complete Debugging Workflow
1. **Start Development Server**:
   ```bash
   cd /path/to/project
   nvm use 12
   pbiviz start
   ```

2. **Launch Chrome Dev with Remote Debugging**:
   ```bash
   /Applications/Google\ Chrome\ Dev.app/Contents/MacOS/Google\ Chrome\ Dev --remote-debugging-port=9222
   ```

3. **Access Development Environment**:
   - Navigate to https://localhost:8080 in Chrome Dev
   - Open Developer Tools (F12 or Cmd+Option+I)
   - Access remote debugging interface at http://localhost:9222

### Advanced Debugging Features
- **Real-time Console Logs**: Monitor visual execution and errors
- **Network Monitoring**: Track API calls to Forge services
- **Performance Profiling**: Analyze rendering performance of 3D models
- **Source Map Debugging**: Debug TypeScript source code directly
- **Memory Analysis**: Monitor memory usage during model loading
- **Remote DevTools**: Access debugging from external interfaces

### PowerBI Integration Testing
1. Enable Developer Mode in PowerBI Service
2. Import developer visual in PowerBI report
3. Configure data fields (dbid, reportID, highlightColor)
4. Monitor console output in Chrome Dev tools
5. Test element coloring functionality

## Data Schema

### Data Fields
1. **dbid** (Grouping): Element database ID from Forge model *(Required)*
2. **reportID** (Measure): Report identifier for model loading *(Required)*
3. **mainReportID** (Measure): Main report identifier for drill-through *(Optional)*
4. **highlightColor** (Grouping): Hex color values for element coloring *(Optional)*

### Example Data Structure
```
| dbid | reportID | mainReportID | highlightColor |
|------|----------|--------------|----------------|
| 1001 | RPT001   | MAIN001      | #FF0000        |
| 1002 | RPT001   | MAIN001      | #00FF00        |
| 1003 | RPT001   | MAIN001      | #0000FF        |
```

## Server Configuration

### Token Endpoint
The visual requires a server endpoint for Forge token generation:
- **Endpoint**: Configured in `MY_SERVER_ENDPOINT` variable
- **Method**: POST request with reportID parameter
- **Response**: JSON with `token` and `urn` properties
- **CORS**: Must include `Access-Control-Allow-Origin` header

### Example Server Response
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI...",
  "urn": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q..."
}
```

## Testing & Validation

### Development Testing
1. Start development server with `pbiviz start`
2. Launch Chrome Dev with remote debugging
3. Enable developer mode in PowerBI
4. Configure test data with valid dbIds and hex colors
5. Monitor console output for errors and extension loading
6. Test color toggle functionality

### Production Validation
1. Build package with `pbiviz package`
2. Upload to PowerBI custom visuals
3. Test with real BIM model data
4. Validate performance with large datasets (30k+ elements)
5. Cross-browser compatibility testing

## Troubleshooting

### Common Issues
- **Forge tokens**: Ensure tokens are properly configured and not expired
- **Model URN**: Verify model URN is accessible and properly formatted
- **Browser console**: Check for extension loading errors in Chrome Dev tools
- **Color format**: Validate hex color format (#RRGGBB)
- **CORS errors**: Ensure server endpoints have proper CORS headers

### Debugging Steps
1. Check development server status at https://localhost:8080/assets/status
2. Monitor network requests in Chrome Dev tools
3. Verify PowerBI data field mappings
4. Test with minimal dataset first
5. Use Chrome Dev remote debugging for detailed analysis

## Security Considerations

- Tokens are requested server-side to avoid client exposure
- No credentials stored in client-side code
- CORS properly configured for API endpoints
- Extension sandbox within Forge Viewer environment
- Remote debugging port only accessible locally

---

**Last Updated**: August 2025  
**Implemented By**: Claude Code Assistant  
**Project Status**: Development Environment Ready