import React, {useEffect} from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { Container, Typography, Paper, Box, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

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

const ResearchEthicsGuidelines = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <Container maxWidth="lg" sx={{ pt: 2, pb: 8 }}>
        <Box className="content-wrapper" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box className="main-content animate-slide" sx={{ flex: '1 1 70%' }}>
            <Paper elevation={1} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
              <Typography variant="h3" component="h1" className="animate-slide" sx={{ 
                mb: 3, 
                color: '#d32f2f',
                fontWeight: 700,
                position: 'relative',
                animationDelay: '100ms',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: 0,
                  width: '80px',
                  height: '3px',
                  backgroundColor: '#d32f2f',
                }
              }}>
                Research Ethics Guidelines
              </Typography>

              <Box sx={{ mt: 5 }}>
                <Typography variant="body1" className="animate-slide" sx={{ mb: 3, lineHeight: 1.7, animationDelay: '200ms' }}>
                  The Global Journal of Construction Management and Engineering is committed to maintaining the highest standards of research integrity. 
                  All authors submitting work to GJCME must adhere to the following ethical guidelines:
                </Typography>

                <Box className="animate-slide" sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 2, mb: 4, animationDelay: '300ms' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f', display: 'flex', alignItems: 'center' }}>
                    <VerifiedUserIcon sx={{ mr: 1 }} /> Author Responsibilities
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>The author should ensure that:</Typography>
                  <List>
                    {[
                      'The research has been carried out with the utmost integrity and rigour.',
                      'The case study, book, chapter, or essay is unique.',
                      'No other magazine has received the work or is considering it. It has not been submitted anywhere. (For exceptions, see the regulations for conference papers and preprints.)',
                      'There are no libellous, defamatory, or illegal statements in the work.',
                      'For any content containing third parties, permission has been acquired.',
                      'Consent proof has been obtained for any mentioned people or groups.',
                      'Authorship has been agreed upon before submission, ensuring no one has been granted or denied authorship inappropriately (no \'gifted\' or \'ghost\' authorship).'
                    ].map((item, index) => (
                      <ListItem key={index} className="animate-slide" sx={{ py: 0.5, animationDelay: `${350 + index * 50}ms` }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box className="animate-slide" sx={{ mb: 4, animationDelay: '700ms' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f', display: 'flex', alignItems: 'center' }}>
                    <LibraryBooksIcon sx={{ mr: 1 }} /> Attribution
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                    In order to provide a thorough documentation of the work history, authors should cite any prior publication or presentation of the concepts included in their current submission, including conference papers, workshop presentations, and listserv discussions. According to the author's rules, references to other works must be formatted in APA7 style. The consistency, correctness, and completeness of each reference should be thoroughly examined.
                  </Typography>
                </Box>

                <Box className="animate-slide" sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 2, mb: 4, animationDelay: '800ms' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f', display: 'flex', alignItems: 'center' }}>
                    <PeopleAltIcon sx={{ mr: 1 }} /> Authorship
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                    When listing the authors of a paper, it is important to avoid common issues such as ghost authorship (exclusion of a contributor), gift/guest authorship (inclusion of someone who hasn't contributed), and disputes over the order of authors and their contributions. Authorship should be agreed upon before submission to prevent these issues. An author must have made substantial contributions to the conception or design of the work, drafted or revised it critically, given final approval of the version to be published, and agreed to be accountable for all aspects of the work. If a contributor does not meet these criteria, they should be included in the acknowledgements instead.
                  </Typography>
                </Box>

                <Box className="animate-slide" sx={{ mb: 4, animationDelay: '900ms' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f', display: 'flex', alignItems: 'center' }}>
                    <WarningAmberIcon sx={{ mr: 1 }} /> Conflicts of Interest
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                    Authors, reviewers, and editors must report any potential conflicts of interest. Authors should declare anything that may have influenced their research or could affect the review process or publication of their article. If uncertain, authors should consult the editor or publisher before submission.
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Possible conflicts of interest include:</Typography>
                  <List>
                    {[
                      'An earlier collaboration between the writer and editor.',
                      'A stake in the research results, either financially or personally.',
                      'Unreported financial assistance from a concerned third party for the study.',
                      'A financial or personal interest in suppressing the research.',
                      'A pending patent.'
                    ].map((item, index) => (
                      <ListItem key={index} className="animate-slide" sx={{ py: 0.5, animationDelay: `${950 + index * 50}ms` }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
                    When submitting work, authors should include a note detailing any financial support for the research from third parties and highlight any other potential conflicts of interest.
                  </Typography>
                </Box>

                <Box className="animate-slide" sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 2, animationDelay: '1200ms' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f', display: 'flex', alignItems: 'center' }}>
                    <ReportProblemIcon sx={{ mr: 1 }} /> Plagiarism
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                    Submitted content should be based on the author's research and expressed in their own words. Failure to do so may be considered plagiarism. GJCME editors use the plagiarism detection service. This, along with the expertise of reviewers and editors, makes it increasingly difficult for plagiarized work to go unnoticed.
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Plagiarism can take various forms:</Typography>
                  <List>
                    {[
                      'Verbatim copying: Copying exact text from another\'s work without proper acknowledgement, references, or quotation marks.',
                      'Paraphrasing: Altering or rearranging content without proper attribution. Serious paraphrasing without credit is considered as grave as direct copying.',
                      'Reusing content without attribution: Using figures, tables, or text from another source without proper permission or credit.'
                    ].map((item, index) => (
                      <ListItem key={index} className="animate-slide" sx={{ py: 0.5, animationDelay: `${1250 + index * 50}ms` }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleOutlineIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="body1" className="animate-slide" sx={{ mt: 3, lineHeight: 1.7, animationDelay: '1400ms' }}>
                    Allegations of plagiarism can significantly impact a researcher's career. When approached by a third party with such an allegation, a response is always sought from the original author(s) or copyright holder(s) before any action is taken. GJCME remains impartial and is not influenced by external parties. All allegations are handled according to the COPE (Committee on Publication Ethics) guidelines.
                  </Typography>
                  
                  <Typography variant="body1" className="animate-slide" sx={{ mt: 3, lineHeight: 1.7, animationDelay: '1450ms' }}>
                    GJCME is not obligated to discuss individual cases of alleged plagiarism with third parties and reserves the right not to proceed if the complainant provides a false name or affiliation, or behaves inappropriately or threateningly towards GJCME editors.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
          
          <Box className="sidebar animate-slide" sx={{ flex: '1 1 30%', animationDelay: '300ms' }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, position: 'relative' }}>
                Journal Information
                <Divider sx={{ mt: 1, mb: 2, height: 3, backgroundColor: '#d32f2f', width: '40px' }} />
              </Typography>
              <Box sx={{ mb: 2, border: '1px solid #eee', p: 2, borderRadius: 1, textAlign: 'center' }}>
                <img src="/cover.jpg" alt="Journal Cover" style={{ maxWidth: '100%', height: 'auto' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>ISSN:</strong> 0975-9972</Typography>
                <Typography variant="body2"><strong>Editor-in-Chief:</strong> Dr. Rajeev Kansal</Typography>
              </Box>
            </Paper>
            
            <Paper elevation={1} className="animate-slide" sx={{ p: 3, borderRadius: 2, animationDelay: '400ms' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, position: 'relative' }}>
                Author Resources
                <Divider sx={{ mt: 1, mb: 2, height: 3, backgroundColor: '#d32f2f', width: '40px' }} />
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem component={Link} to="/AuthorGuidelines" className="animate-slide" sx={{ 
                  color: '#333', 
                  textDecoration: 'none',
                  animationDelay: '450ms',
                  '&:hover': { color: '#d32f2f', bgcolor: 'rgba(0,0,0,0.03)' }
                }}>
                  <ListItemText primary="Author Guidelines" />
                </ListItem>
                <ListItem component={Link} to="/SubmissionTemplate" className="animate-slide" sx={{ 
                  color: '#333', 
                  textDecoration: 'none',
                  animationDelay: '500ms',
                  '&:hover': { color: '#d32f2f', bgcolor: 'rgba(0,0,0,0.03)' }
                }}>
                  <ListItemText primary="Submission Guidelines" />
                </ListItem>
                <ListItem component={Link} to="/ResearchEthicsGuidelines" className="animate-slide" sx={{ 
                  color: '#d32f2f', 
                  textDecoration: 'none',
                  animationDelay: '550ms',
                  bgcolor: 'rgba(211,47,47,0.05)',
                  borderLeft: '3px solid #d32f2f',
                  pl: 2
                }}>
                  <ListItemText primary="Research Ethics Guidelines" />
                </ListItem>
                  <ListItem component="a" href="/copyright.pdf" target="_blank" className="animate-slide" sx={{ 
                  color: '#333', 
                  textDecoration: 'none',
                  animationDelay: '600ms',
                  '&:hover': { color: '#d32f2f', bgcolor: 'rgba(0,0,0,0.03)' }
                }}>
                  <ListItemText primary="Copyright Form" />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ResearchEthicsGuidelines; 