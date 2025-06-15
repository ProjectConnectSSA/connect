Local Testing Setup

Edit hosts File:

macOS/Linux: Open Terminal and run sudo nano /etc/hosts

Windows: Open Notepad as Administrator and open C:\Windows\System32\drivers\etc\hosts

Add a line at the bottom:

127.0.0.1 mytestdomain.local Use code with caution. (Replace mytestdomain.local with your desired test domain name). You can add multiple lines for different test domains.

Save the file. You might need to flush your DNS cache (ipconfig /flushdns on Windows, varies on macOS/Linux).

Run Your App: npm run dev or yarn dev.

Configure in Editor:

Navigate to http://localhost:3000/edit/my-test-page (or any slug you want).

Go to the "Settings" tab.

Enter the exact domain you added to your hosts file (e.g., mytestdomain.local) into the "Custom Domain" field.

Ensure the "Page Slug" is set (e.g., my-test-page).

Add some elements and style the page.

Click "Save Page Settings" or the main "Save" button. Check your browser's developer console and the Next.js terminal for logs/errors. Verify the data appears in your Supabase bio_pages table.

Test Custom Domain:

Open a new browser tab and navigate to http://mytestdomain.local:3000.

Expected Behavior:

The middleware should intercept the request because the host (mytestdomain.local:3000) is not localhost:3000.

It queries Supabase for custom_domain = 'mytestdomain.local:3000'. Correction: The host includes the port. You might need to save mytestdomain.local:3000 in Supabase or strip the port in the middleware before querying. Let's strip the port in middleware for flexibility.

If it finds the record with the slug my-test-page, it rewrites the URL internally to /dashboard/links/view/my-test-page.

The /dashboard/links/view/[identifier]/page.tsx route handler receives my-test-page as the identifier, fetches the data, and renders your bio link page.

The URL in the browser remains http://mytestdomain.local:3000.

Test Slug: Navigate to http://localhost:3000/dashboard/links/view/my-test-page. This should directly load the public page without middleware intervention.
