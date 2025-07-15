import React, {useEffect} from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Animation styles
const AnimatedSection = styled('section')(({ theme, delay = 0 }) => ({
  animationName: 'fadeIn',
  animationDuration: '0.8s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

const AnimatedHeading = styled('h1')(({ theme, delay = 0 }) => ({
  animationName: 'slideDown',
  animationDuration: '0.5s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

const AnimatedH2 = styled('h2')(({ theme, delay = 0 }) => ({
  animationName: 'slideRight',
  animationDuration: '0.5s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

const AnimatedParagraph = styled('p')(({ theme, delay = 0 }) => ({
  animationName: 'fadeIn',
  animationDuration: '0.8s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

const AnimatedList = styled('ul')(({ theme, delay = 0 }) => ({
  animationName: 'slideUp',
  animationDuration: '0.7s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

const AnimatedAside = styled('aside')(({ theme, delay = 0 }) => ({
  animationName: 'slideLeft',
  animationDuration: '0.8s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

const AnimatedDiv = styled('div')(({ theme, delay = 0 }) => ({
  animationName: 'fadeIn',
  animationDuration: '0.8s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

const Footer = () => (
  <AnimatedDiv className="main-footer" delay={800}>
    <div className="footer-content">
      <div className="footer-info">
        <h3>Global Journal of Construction Management and Engineering</h3>
        <p>A premier scholarly platform for advancing knowledge in construction management and engineering, fostering rigorous research and critical discourse in these vital fields.</p>
      </div>
      <div className="footer-contact">
        <h3>Contact Us</h3>
        <p><a href="mailto:info@lordtechdatus.com">Email: info@lordtechdatus.com</a></p>
        <p style={{fontSize:18 , fontWeight:500}} >Phone: +91 99817 56433</p>
        <p>Address: G1, Akansha Apartment, Patel Nagar, City Centre, Gwalior, Near Raj Rajeshwari Apartment , 474002</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024 Global Journal of Construction Management and Engineering. All rights reserved.</p>
    </div>
  </AnimatedDiv>
);

const AuthorGuidelines = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <main className="container" style={{ animation: 'fadeIn 0.8s ease-in-out' }}>
        <div className="content-wrapper">
          <AnimatedSection className="main-content" delay={200}>
            <AnimatedHeading delay={100}>✍️ Author Guidelines</AnimatedHeading>
            <AnimatedParagraph className="description" delay={200}>
              The Global Journal of Construction Management and Engineering invites original, high-quality research papers, review articles, and technical notes in the field of Civil Engineering. Submissions must be unpublished and not under consideration elsewhere.
            </AnimatedParagraph>
            
            <AnimatedH2 delay={300}>📑 Manuscript Categories</AnimatedH2>
            <AnimatedList delay={400}>
              <li>Original Research Articles (3000–5000 words)</li>
              <li>Review Articles (4000–6000 words)</li>
              <li>Technical Notes / Case Studies (1500–4000 words)</li>
              <li>Short Communications (up to 2500 words)</li>
            </AnimatedList>

            <AnimatedH2 delay={450}>🛠️ Manuscript Preparation</AnimatedH2>
            <AnimatedParagraph className="description" delay={500}>
              All manuscripts must strictly follow the article template available on the journal's official website. Submissions that do not adhere to the template will be returned for revision before being considered for peer review.
            </AnimatedParagraph>

            <AnimatedH2 delay={550}>🧾 Plagiarism Policy</AnimatedH2>
            <AnimatedParagraph className="description" delay={600}>
              Manuscripts must have a plagiarism level below 15%, excluding references. Submissions will be screened using [Turnitin/iThenticate/other software].
            </AnimatedParagraph>

            <AnimatedH2 delay={650}>🔄 Peer Review Process</AnimatedH2>
            <AnimatedParagraph className="description" delay={700}>
              All submissions undergo double-blind peer review by at least two independent experts. The average turnaround time is 4–6 weeks.
            </AnimatedParagraph>

            <AnimatedH2 delay={750}>💡 Submission Process</AnimatedH2>
            <AnimatedParagraph className="description" delay={800}>
              Submit manuscripts via our online portal: [submission link]<br />
              For any queries, assistance, or technical support during the submission process, please contact the editorial office:<br />
              Mr. Prateek Bajpayee<br />
              Editorial Coordinator<br />
             <b>Email:</b> prateekbajpai1854@gmail.com
            </AnimatedParagraph>

            <AnimatedH2 delay={850}>📢 Publishing Ethics</AnimatedH2>
            <AnimatedParagraph className="description" delay={900}>
              The journal adheres to the guidelines of COPE (Committee on Publication Ethics). Authors must declare any conflicts of interest and obtain ethical approval where necessary.
            </AnimatedParagraph>

            <AnimatedH2 delay={950}>📝 Article Processing Charges (APC)</AnimatedH2>
            <AnimatedParagraph className="description" delay={1000}>
              We follow a full open access policy with no submission or publication fees, ensuring free and unrestricted access to all published content.
            </AnimatedParagraph>
          </AnimatedSection>
          
          <AnimatedAside className="sidebar" delay={400}>
            <AnimatedDiv className="journal-detail" delay={500}>
              <h2>Journal Information</h2>
              <div className="yellow-line"></div>
              <div className="cover-image">
                <img src="cover.jpg" alt="Journal Cover" />
              </div>
              <div className="journal-info">
                <p><strong>ISSN:</strong>0975-9972</p>
                <p><strong>Editor-in-Chief:</strong> Dr. Rajeev Kansal</p>
              </div>
            </AnimatedDiv>
            
            <AnimatedDiv className="downloads" delay={700}>
              <h2>Author Resources</h2>
              <div className="yellow-line"></div>
              <ul>
                <li><Link to="/author-guidelines">Author Guidelines</Link></li>
                <li><Link to="/submission-template">Submission Template</Link></li>
                <li><a href="/copyright.pdf" target="_blank">Copyright Form</a></li>
              </ul>
            </AnimatedDiv>
          </AnimatedAside>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AuthorGuidelines; 