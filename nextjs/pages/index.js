import Head from "next/head";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material"; 
import { useRouter } from "next/router"; // Import useRouter for navigation
import useBearStore from "@/store/useBearStore";

function Home() {
  const router = useRouter(); // Initialize the router

  const handleGetStartedClick = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <>
      <main>
        <Box 
          display="flex" 
          flexDirection="column" // Stack items vertically
          justifyContent="center" 
          alignItems="center" 
          height="100vh" // Full viewport height
        >
          <Typography variant="h4">Dracarys Library</Typography>
          <Image 
            src="/Untitled design.png" // Ensure this path is correct
            alt="Descriptive Alt Text" 
            width={200}
            height={200}
            style={{ marginTop: '20px' }} // Add space above the image
          />
          <Typography variant="body1" style={{ marginTop: '10px', textAlign: 'center' }}>
            A place for all your book borrowing needs.
          </Typography>
          
          {/* Rectangle button with rounded corners */}
          <Button 
            variant="contained" // Use contained button style
            color="primary" 
            style={{ 
              marginTop: '20px', 
              borderRadius: '20px', // Set rounded corners
              padding: '10px 20px', // Add padding for height and width
              fontSize: '16px' // Custom font size
            }} 
            onClick={handleGetStartedClick} // Handle click event
          >
            Get Started
          </Button>
        </Box>
      </main>
    </>
  );
}

export default Home;
