import React from 'react';
import { Box, Typography, Paper, Button, Divider, Fade, useTheme } from '@mui/material';
import { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EmailIcon from '@mui/icons-material/Email';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GroupIcon from '@mui/icons-material/Group';
import { motion, AnimatePresence } from 'framer-motion';

// Animated icon wrapper
const AnimatedIcon = ({ children, delay }) => (
  <motion.div
    initial={{ scale: 0.7, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    {children}
  </motion.div>
);

const steps = [
  {
    label: 'Author Submission',
    icon: <CloudUploadIcon color="primary" fontSize="large" />, // will wrap in AnimatedIcon
    description: (
      <>
Author submits research work to GJCME via online submission on our website (<a href="https://www.lordtechdatus.com" target="_blank" rel="noopener noreferrer">www.lordtechdatus.com</a>) after signing up or registering an account.
</>
    ),
  },
  {
    label: 'Editor Initial Check',
    icon: <EditNoteIcon color="primary" fontSize="large" />, // will wrap in AnimatedIcon
    description: (
      <>
        Articles are checked for format, grammar, and formatting mistakes (max 2 per page). All papers are double-blind reviewed by at least two reviewers, ideally three or more.
      </>
    ),
  },
  {
    label: 'Reviewer Evaluation',
    icon: <GroupIcon color="primary" fontSize="large" />, // will wrap in AnimatedIcon
    description: (
      <>
        Subject experts review the work and provide a status:<br/>
        <b>Accepted</b>, <b>Rejected</b>, <b>Accepted with Minor Changes</b>, <b>Accepted with Major Changes</b>.
      </>
    ),
  },
  {
    label: 'Author Revision',
    icon: <EditNoteIcon color="primary" fontSize="large" />, // will wrap in AnimatedIcon
    description: (
      <>
        If accepted, the author submits the final manuscript, online maintenance charges, and copyright form. Download format from <a href="https://www.lordtechdatus.com" target="_blank" rel="noopener noreferrer">our website</a>.
      </>
    ),
  },
  {
    label: 'Editor to Publisher',
    icon: <AssignmentTurnedInIcon color="primary" fontSize="large" />, // will wrap in AnimatedIcon
    description: (
      <>
        Editor sends the completed manuscript to the publisher.
      </>
    ),
  },
  {
    label: 'Publication',
    icon: <CheckCircleIcon color="primary" fontSize="large" />, // will wrap in AnimatedIcon
    description: (
      <>
        Publisher publishes the manuscript in the current issue.
      </>
    ),
  },
  {
    label: 'Notification',
    icon: <EmailIcon color="primary" fontSize="large" />, // will wrap in AnimatedIcon
    description: (
      <>
        Editor informs the author via e-mail.
      </>
    ),
  },
];

const reviewerRequirements = [
  'You should be a research author with at least a single GJCME publication.',
  'You should be an author with a minimum of 5 publications in reputed journals.',
];

export default function PeerReview() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  // Animated background shapes
  const bgShapes = (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.12, y: 0 }}
        transition={{ duration: 1.2 }}
        style={{
          position: 'absolute',
          top: '-60px',
          left: '-80px',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1976d2 60%, #90caf9 100%)',
          zIndex: 0,
          filter: 'blur(8px)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.10, y: 0 }}
        transition={{ duration: 1.4 }}
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-60px',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e3f2fd 60%, #1976d2 100%)',
          zIndex: 0,
          filter: 'blur(12px)',
        }}
      />
    </>
  );

  // Variants for title/intro
  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  // Pulse for CTA
  const pulse = {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(25, 118, 210, 0.18)',
        '0 0 0 12px rgba(25, 118, 210, 0.10)',
        '0 0 0 0 rgba(25, 118, 210, 0.18)'
      ],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif',
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f5faff 0%, #e3eafc 100%)',
        position: 'relative',
        py: { xs: 2, sm: 4 },
        px: { xs: 0, sm: 2 },
        overflow: 'hidden',
      }}
    >
      {bgShapes}
      <Box sx={{ maxWidth: 980, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: '2rem',
              boxShadow: '0 4px 32px rgba(25, 118, 210, 0.08)',
              mb: 4,
              background: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" fontWeight={800} color="primary.main" gutterBottom sx={{ fontFamily: 'inherit', letterSpacing: '-1px' }}>
              GJCME Peer Review Process
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1.5, fontFamily: 'inherit', fontWeight: 400 }}>
              Discover the transparent, multi-stage peer review process at GJCME
            </Typography>
          </Paper>
        </motion.div>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 2, sm: 3 },
            mb: 5,
            px: { xs: 0.5, sm: 0 },
          }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.13 + 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
              whileHover={{ scale: 1.045, boxShadow: '0 8px 32px rgba(25,118,210,0.13)' }}
              style={{
                width: 260,
                minHeight: 210,
                margin: 0,
                cursor: 'pointer',
                borderRadius: '1.5rem',
                background: '#fff',
                boxShadow: '0 2px 12px rgba(25,118,210,0.07)',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'box-shadow 0.22s, transform 0.22s',
                border: activeStep === idx ? '2.5px solid #1976d2' : '2.5px solid transparent',
              }}
              onClick={handleStep(idx)}
            >
              <AnimatedIcon delay={0.2 + idx * 0.13}>{step.icon}</AnimatedIcon>
              <Typography variant="subtitle1" fontWeight={700} color={activeStep === idx ? 'primary.main' : 'text.primary'} align="center" sx={{ mb: 1, mt: 1, fontFamily: 'inherit' }}>
                {step.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ fontFamily: 'inherit' }}>
                {step.description}
              </Typography>
            </motion.div>
          ))}
        </Box>
        <Fade in>
          <Paper
            elevation={0}
            sx={{
              minHeight: 120,
              mb: 4,
              borderRadius: '2rem',
              background: '#f7fafd',
              boxShadow: '0 2px 16px rgba(25,118,210,0.07)',
              p: { xs: 2, sm: 4 },
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom sx={{ fontFamily: 'inherit' }}>
              {steps[activeStep].label}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'inherit' }}>
              {steps[activeStep].description}
            </Typography>
          </Paper>
        </Fade>
        <Divider sx={{ my: 4, borderColor: '#e3eafc' }} />
        <motion.div
          variants={pulse}
          animate="animate"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: '2rem',
              boxShadow: '0 4px 32px rgba(25, 118, 210, 0.10)',
              p: { xs: 2.5, sm: 4 },
              background: '#fff',
              maxWidth: 600,
              width: '100%',
              mx: 'auto',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" fontWeight={800} color="primary.main" gutterBottom sx={{ fontFamily: 'inherit' }}>
              Join GJCME as Reviewer
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontFamily: 'inherit' }}>
              GJCME welcomes competent academicians to join us as editor/reviewer. Being an editor/reviewer is a matter of prestige and personal achievement. GJCME follows a strict set of guidelines while accepting applicants as editors/reviewers. The minimum set of qualifications for being a reviewer of GJCME is listed below:
            </Typography>
            <ul style={{ textAlign: 'left', display: 'inline-block', margin: 0, padding: 0, fontFamily: 'inherit' }}>
              {reviewerRequirements.map((req, idx) => (
                <li key={idx} style={{ marginBottom: 8, fontSize: '1rem', color: theme.palette.text.secondary }}>{req}</li>
              ))}
            </ul>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontFamily: 'inherit' }}>
              Download our membership form and send it to <a href="mailto:Info@lordtechdatus.com">Info@lordtechdatus.com</a> with a brief bio-data for our internal purposes. GJCME will revert back within 3 working days.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 3,
                fontWeight: 700,
                borderRadius: '1.5rem',
                px: 4,
                fontFamily: 'inherit',
                boxShadow: '0 2px 12px rgba(25,118,210,0.13)',
                transition: 'background 0.18s, color 0.18s, transform 0.18s',
                '&:hover': {
                  background: '#1565c0',
                  color: '#fff',
                  transform: 'translateY(-2px) scale(1.04)',
                  boxShadow: '0 6px 24px rgba(25,118,210,0.18)',
                },
              }}
              startIcon={<PersonAddAltIcon />}
              href="/signup"
            >
              Apply as Reviewer
            </Button>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
} 