# Tidio Chat Widget Integration Guide

## Overview
This guide explains how to integrate the Tidio Chat Widget into your React.js frontend and PHP backend website.

## React.js Frontend Implementation

### 1. Script Placement ✅ COMPLETED
The Tidio script has been added to `public/index.html` in the `<head>` section:
```html
<script src="//code.tidio.co/kxmefq2rftxfzoffc2r9n4j21pnznmoe.js" async></script>
```

### 2. React Component ✅ COMPLETED
The `TidioWidget.js` component has been created and integrated into your `App.js`.

### 3. Using the Widget in React Components

#### Basic Usage
The widget is automatically available on all pages. You can control it from any component:

```javascript
// Show the widget
window.tidioWidget.show();

// Hide the widget
window.tidioWidget.hide();

// Open the chat
window.tidioWidget.open();

// Close the chat
window.tidioWidget.close();
```

#### Example: Add a chat button to a component
```javascript
import React from 'react';

const ContactButton = () => {
  const handleChatClick = () => {
    if (window.tidioWidget) {
      window.tidioWidget.open();
    }
  };

  return (
    <button onClick={handleChatClick}>
      Chat with us
    </button>
  );
};

export default ContactButton;
```

#### Example: Set visitor data when user logs in
```javascript
// In your login component
const handleLogin = (userData) => {
  // Your login logic here
  
  // Set visitor data for Tidio
  if (window.tidioChatApi) {
    window.tidioChatApi.setVisitorData({
      email: userData.email,
      name: userData.name,
      phone: userData.phone
    });
  }
};
```

## PHP Backend Implementation

### 1. Basic Usage
Include the Tidio script in your PHP template files:

```php
<?php
require_once 'tidio_integration.php';

// In your template file (e.g., header.php, footer.php, or main template)
include_tidio_script();
?>
```

### 2. Advanced Usage with Configuration
```php
<?php
require_once 'tidio_integration.php';

// Get current user data (if logged in)
$current_user = get_current_user_data(); // Your user data function

$options = [
    'hide_on_load' => false,
    'visitor_data' => get_tidio_visitor_data($current_user),
    'custom_events' => ['page_viewed', 'user_logged_in']
];

include_tidio_script_with_config($options);
?>
```

### 3. PHP Template Examples

#### Header Template (header.php)
```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website</title>
    <?php include_tidio_script(); ?>
</head>
<body>
    <!-- Your header content -->
```

#### Footer Template (footer.php)
```php
    <!-- Your footer content -->
    <?php include_tidio_script(); ?>
</body>
</html>
```

#### Main Template with User Data
```php
<?php
require_once 'tidio_integration.php';

// Get user data if logged in
$user_data = null;
if (isset($_SESSION['user_id'])) {
    $user_data = get_user_data($_SESSION['user_id']); // Your user data function
}

$options = [
    'visitor_data' => get_tidio_visitor_data($user_data)
];

include_tidio_script_with_config($options);
?>
```

## Ensuring Seamless Integration

### 1. Asynchronous Loading ✅
- The script uses the `async` attribute to prevent blocking page rendering
- The React component waits for the widget to load before initializing

### 2. Cross-Platform Compatibility
- The widget works on both React.js frontend and PHP backend
- No conflicts between the two implementations
- Consistent user experience across platforms

### 3. Performance Optimization
- Script loads asynchronously
- React component uses efficient polling to detect when Tidio is ready
- No impact on page load times

### 4. Testing the Integration

#### React.js Testing
1. Start your React development server: `npm start`
2. Open the browser console
3. You should see: "Tidio widget loaded successfully"
4. Test the widget controls:
   ```javascript
   window.tidioWidget.show();
   window.tidioWidget.hide();
   window.tidioWidget.open();
   ```

#### PHP Testing
1. Include the script in your PHP template
2. Check browser console for any errors
3. Verify the widget appears on your PHP pages

### 5. Troubleshooting

#### Widget Not Loading
- Check browser console for JavaScript errors
- Verify the script URL is correct
- Ensure no ad blockers are blocking the script

#### Widget Not Appearing
- Check if the script is loading in Network tab
- Verify the Tidio account is active
- Test with different browsers

#### React Component Issues
- Ensure `TidioWidget` is imported in `App.js`
- Check for any JavaScript errors in console
- Verify the component is rendering (should be invisible)

## Advanced Features

### 1. Custom Events
```javascript
// Track custom events
if (window.tidioChatApi) {
    window.tidioChatApi.track('custom_event', {
        event_type: 'form_submitted',
        page: window.location.pathname
    });
}
```

### 2. Visitor Data Management
```javascript
// Set visitor data
window.tidioChatApi.setVisitorData({
    email: 'user@example.com',
    name: 'John Doe',
    phone: '+1234567890',
    custom_fields: {
        user_type: 'premium',
        subscription: 'monthly'
    }
});
```

### 3. Widget Customization
```javascript
// Hide widget on specific pages
if (window.location.pathname === '/admin') {
    window.tidioWidget.hide();
}

// Show widget only for logged-in users
if (isUserLoggedIn) {
    window.tidioWidget.show();
}
```

## Security Considerations

1. **Script Source**: The script loads from Tidio's CDN, which is secure and trusted
2. **Visitor Data**: Only share necessary user information with Tidio
3. **GDPR Compliance**: Ensure your privacy policy covers chat widget usage
4. **Data Protection**: Be mindful of what visitor data you share

## Maintenance

1. **Regular Updates**: Keep your React and PHP code updated
2. **Monitor Performance**: Check for any impact on page load times
3. **User Feedback**: Monitor user experience with the chat widget
4. **Analytics**: Use Tidio's analytics to optimize chat performance

## Support

- **Tidio Documentation**: https://support.tidio.com/
- **React Issues**: Check React component console logs
- **PHP Issues**: Verify script inclusion in PHP templates
- **General Issues**: Check browser console for JavaScript errors
