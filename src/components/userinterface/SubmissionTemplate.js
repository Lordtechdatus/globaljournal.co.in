import React, {useEffect} from "react";
import "./styles.css";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="main-footer animate-slide">
    <div className="footer-content">
      <div className="footer-info">
        <h3>Global Journal of Construction Management and Engineering</h3>
        <p>A premier scholarly platform for advancing knowledge in construction management and engineering, fostering rigorous research and critical discourse in these vital fields.</p>
      </div>
      <div className="footer-contact">
        <h3>Contact Us</h3>
        <p><a href="mailto:info@lordtechdatus.com">Email: info@lordtechdatus.com</a></p>
        <p className="animate-slide" style={{fontSize:18, fontWeight:500, animationDelay: '300ms'}}>Phone: +91 99817 56433</p>
        <p>Address: G1, Akansha Apartment, Patel Nagar, City Centre, Gwalior, Near Raj Rajeshwari Apartment , 474002</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024 Global Journal of Construction Management and Engineering. All rights reserved.</p>
    </div>
  </footer>
);

const SubmissionTemplate = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <main className="container">
        <div className="content-wrapper">
          <section className="main-content animate-slide">
            <h1>Submission Template</h1>
            <p className="description">
              Use the following template for your submissions to the Global Journal of Construction Management and Engineering.
              This template ensures consistency and proper formatting of all published articles.
            </p>
            
            <div className="template-content">
              <h2 className="animate-slide" style={{animationDelay: '100ms'}}>Title of the Paper (Times New Roman, 14pt, Bold, Centered)</h2>
              
              <p className="animate-slide" style={{animationDelay: '150ms'}}>Author1*, Author2, Author3.....</p>
              <p className="animate-slide" style={{animationDelay: '200ms'}}>Affiliation(s): Designation, Department, Institution, City, Country, Email:...</p>
              <p className="animate-slide" style={{animationDelay: '250ms'}}>*Corresponding Author</p>
              
              <h3 className="animate-slide" style={{animationDelay: '300ms'}}>Abstract (Times New Roman, 12pt, Bold)</h3>
              <p className="animate-slide" style={{animationDelay: '350ms'}}><strong>Background:</strong> Briefly describe the context and the motivation for the study. What problem is being addressed?</p>
              <p className="animate-slide" style={{animationDelay: '400ms'}}><strong>Objectives:</strong> State the primary aim(s) of the research. What were you trying to find out?</p>
              <p className="animate-slide" style={{animationDelay: '450ms'}}><strong>Methods:</strong> Summarize the methodology or approach used—experimental design, analytical techniques, modeling, or data analysis.</p>
              <p className="animate-slide" style={{animationDelay: '500ms'}}><strong>Results:</strong> Present the key findings or outcomes of the study.</p>
              <p className="animate-slide" style={{animationDelay: '550ms'}}><strong>Conclusion:</strong> Highlight the main conclusion(s) and implications of the findings. How do the results contribute to the field or relate to the conference theme?</p>
              <p className="animate-slide" style={{animationDelay: '600ms'}}><strong>Keywords:</strong> 4–6 keywords separated by commas</p>
              
              <h3 className="animate-slide" style={{animationDelay: '650ms'}}>1. Introduction</h3>
              <p className="animate-slide" style={{animationDelay: '700ms'}}>Begin with background information and the significance of the research topic. Clearly state the problem, purpose, and objectives of the study. Ensure a smooth transition into the literature review.</p>
              
              <h3 className="animate-slide" style={{animationDelay: '750ms'}}>2. Literature Review</h3>
              <p className="animate-slide" style={{animationDelay: '800ms'}}>Summarize and synthesize relevant prior studies. Highlight gaps in current knowledge, contrasting findings, and how your study builds upon or differs from existing work. Cite sources using APA in-text citation format. For example:</p>
              <blockquote className="animate-slide" style={{animationDelay: '850ms'}}>Civil engineering has rapidly evolved through the integration of digital tools (Smith & Gupta, 2020).</blockquote>
              <p className="animate-slide" style={{animationDelay: '900ms'}}>Use chronological, thematic, or methodological organization as appropriate.</p>
              
              <h3 className="animate-slide" style={{animationDelay: '950ms'}}>3. Methodology</h3>
              <p className="animate-slide" style={{animationDelay: '1000ms'}}>Describe the study design, data collection techniques, analytical tools, software used (if any), and procedures followed. Include enough detail to allow replication.</p>
              
              <h3 className="animate-slide" style={{animationDelay: '1050ms'}}>4. Results</h3>
              <p className="animate-slide" style={{animationDelay: '1100ms'}}>Present major findings using text, tables, and figures. APA requires that tables and figures be numbered (Table 1, Figure 1) and include a title and legend. Refer to them in-text.</p>
              
              <h3 className="animate-slide" style={{animationDelay: '1150ms'}}>5. Discussion</h3>
              <p className="animate-slide" style={{animationDelay: '1200ms'}}>Interpret the results and compare them with existing literature. Discuss implications, limitations, and practical applications of your findings.</p>
              
              <h3 className="animate-slide" style={{animationDelay: '1250ms'}}>6. Conclusion</h3>
              <p className="animate-slide" style={{animationDelay: '1300ms'}}>Summarize the key outcomes, their relevance, and potential future work directions.</p>
              
              <h3 className="animate-slide" style={{animationDelay: '1350ms'}}>Acknowledgements <em>(Optional)</em></h3>
              <p className="animate-slide" style={{animationDelay: '1400ms'}}>Mention supporting institutions, funding bodies, or individuals who helped with the research.</p>
              
              <h3 className="animate-slide" style={{animationDelay: '1450ms'}}>References</h3>
              <p className="animate-slide" style={{animationDelay: '1500ms'}}>Use APA 7th edition style. Examples:</p>
              <ul className="animate-slide" style={{animationDelay: '1550ms'}}>
                <li><strong>Journal Article:</strong><br />
                Smith, J. A., & Gupta, R. K. (2020). Advances in sustainable construction materials. <em>Journal of Civil Engineering and Sustainability</em>, <em>15</em>(3), 123–135. https://doi.org/10.1016/j.jces.2020.03.005</li>
                <li><strong>Book:</strong><br />
                Sharma, A. (2018). <em>Modern geotechnical engineering</em>. Springer Nature.</li>
                <li><strong>Conference Paper:</strong><br />
                Patel, V. (2021). BIM integration in urban infrastructure. In <em>Proceedings of the International Conference on Smart Cities</em> (pp. 55–62). IEEE.</li>
              </ul>
              
              <h3 className="animate-slide" style={{animationDelay: '1600ms'}}>Formatting Guidelines</h3>
              <ul className="animate-slide" style={{animationDelay: '1650ms'}}>
                <li><strong>File Format:</strong> MS Word (.docx) or PDF</li>
                <li><strong>Font:</strong> Times New Roman</li>
                <li><strong>Font Size:</strong> 12 pt throughout</li>
                <li><strong>Line Spacing:</strong> 1.5 (including references)</li>
                <li><strong>Margins:</strong> 1 inch on all sides</li>
                <li><strong>Alignment:</strong> Left-aligned text (do not justify)</li>
                <li><strong>Page Numbers:</strong> bottom-right corner</li>
                <li><strong>In-text Citations & References:</strong> APA 7th Edition</li>
              </ul>
            </div>
          </section>
          
          <aside className="sidebar animate-slide" style={{animationDelay: '300ms'}}>
            <div className="journal-detail">
              <h2>Journal Information</h2>
              <div className="yellow-line"></div>
              <div className="cover-image">
                <img src="cover.jpg" alt="Journal Cover" />
              </div>
              <div className="journal-info">
                <p><strong><span>ISSN:</span></strong> 0975 9972</p>
                <p><strong><span>Editor-in-Chief:</span></strong> Dr. Rajeev Kansal</p>
              </div>
            </div>
            
            <div className="downloads animate-slide" style={{animationDelay: '400ms'}}>
              <h2>Author Resources</h2>
              <div className="yellow-line"></div>
              <ul>
                <li><Link to="/author-guidelines">Author Guidelines</Link></li>
                <li><Link to="/submission-template">Submission Template</Link></li>
                <li><a href="/copyright.pdf" target="_blank">Copyright Form</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SubmissionTemplate; 