/**
 * Application Entry Point
 * Instantiates the App after DOM and all extensions are ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Ensure sidebar and other dynamic UI components are registered first
    // by being loaded before this script in index.html
    const appInstance = new App();
    // Expose the running app instance for diagnostics and integrations
    try { 
        window.app = appInstance; 
    } catch (e) { 
        console.warn('Could not expose app instance to window.app');
    }
});