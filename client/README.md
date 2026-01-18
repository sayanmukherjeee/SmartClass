npm create vite@latest frontend -- --template react
cd frontend
npm install
mkdir src\api
mkdir src\components
mkdir src\pages
mkdir src\context
mkdir src\hooks
mkdir src\routes
mkdir src\styles
ni src\api\axiosClient.js
ni src\api\authApi.js
ni src\components\Navbar.jsx
ni src\components\ProtectedRoute.jsx
ni src\components\Loader.jsx
ni src\pages\Login.jsx
ni src\pages\Register.jsx
ni src\pages\AdminDashboard.jsx
ni src\pages\UserDashboard.jsx
ni src\context\AuthContext.jsx
ni src\hooks\useAuth.js
ni src\routes\AppRoutes.jsx
ni src\styles\global.css
ni src\styles\form.css
del src\assets -Recurse
del src\App.css
del src\App.jsx
del src\index.css
