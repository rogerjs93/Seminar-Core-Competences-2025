import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
  Button,
  Chip,
  Stack
} from "@mui/material";

const GITHUB_API_BASE = "https://api.github.com";
const OWNER = "rogerjs93";
const REPO = "Seminar-Core-Competences-2025";
const ASSIGNMENTS = ["assigment1", "assigment2", "assigment3", "assigment4", "assigment5"];

type Submission = {
  name: string;
  files: string[];
  notes: string | null;
};

function fetchAssignmentFolders(assignment: string): Promise<Submission[]> {
  return fetch(
    `${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/contents/${assignment}`
  )
    .then((res) => res.json())
    .then(async (entries) => {
      if (!Array.isArray(entries)) return [];
      const folders = entries.filter((e: any) => e.type === "dir");
      const submissions = await Promise.all(
        folders.map(async (folder: any) => {
          const files = await fetch(
            `${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/contents/${assignment}/${folder.name}`
          )
            .then((res) => res.json())
            .then((files) =>
              Array.isArray(files) ? files.map((f: any) => f.name) : []
            );
          const notesFile = files.find((f: string) => f === "notes.md") || null;
          return {
            name: folder.name,
            files: files.filter((f: string) => f !== "notes.md"),
            notes: notesFile
          };
        })
      );
      return submissions;
    });
}

const AssignmentCard: React.FC<{ assignment: string }> = ({ assignment }) => {
  const [subs, setSubs] = useState<Submission[] | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchAssignmentFolders(assignment).then(setSubs);
  }, [assignment]);

  const handleCardClick = () => {
    setExpanded(!expanded);
  };

  const handleViewOnGitHub = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(`https://github.com/${OWNER}/${REPO}/tree/main/${assignment}`, '_blank');
  };

  return (
    <Card sx={{ mb: 3, cursor: 'pointer' }}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" color="primary">
              📚 {assignment.replace("assigment", "Assignment ")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip 
                size="small" 
                label={subs ? `${subs.length} submissions` : 'Loading...'} 
                color="primary" 
                variant="outlined"
              />
              <Button
                size="small"
                onClick={handleViewOnGitHub}
                variant="outlined"
              >
                View on GitHub
              </Button>
            </Stack>
          </Box>
          
          {expanded && (
            <Box mt={2}>
              {subs === null ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Loading submissions...</Typography>
                </Box>
              ) : (
                <List>
                  {subs.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary="📝 No submissions yet" 
                        secondary="Click 'View on GitHub' to explore the assignment folder or submit your work."
                      />
                    </ListItem>
                  ) : (
                    subs.map((s) => (
                      <ListItem key={s.name} alignItems="flex-start">
                        <ListItemText
                          primary={<strong>📁 {s.name}</strong>}
                          secondary={
                            <Box mt={1}>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {s.files.map((f) => (
                                  <MuiLink
                                    key={f}
                                    href={`https://github.com/${OWNER}/${REPO}/blob/main/${assignment}/${s.name}/${f}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ display: 'inline-block', mr: 1, mb: 0.5 }}
                                  >
                                    📄 {f}
                                  </MuiLink>
                                ))}
                                {s.notes && (
                                  <MuiLink
                                    href={`https://github.com/${OWNER}/${REPO}/blob/main/${assignment}/${s.name}/notes.md`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ display: 'inline-block', mr: 1, mb: 0.5, fontWeight: 'bold' }}
                                  >
                                    📝 Notes
                                  </MuiLink>
                                )}
                              </Stack>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Box>
          )}
          
          {!expanded && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Click to expand and view submissions, or use "View on GitHub" to browse the folder directly.
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          🎓 Seminar Core Competences 2025
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Assignment Repository & Documentation Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Click on assignment cards to view submissions, or use the GitHub button to browse folders directly.
        </Typography>
      </Box>

      <Box>
        {ASSIGNMENTS.map((assignment) => (
          <AssignmentCard key={assignment} assignment={assignment} />
        ))}
      </Box>

      <Box textAlign="center" mt={4} p={3} bgcolor="background.paper" border="1px solid" borderColor="divider" borderRadius={2}>
        <Typography variant="h6" gutterBottom>
          📋 Quick Actions
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="outlined"
            href={`https://github.com/${OWNER}/${REPO}`}
            target="_blank"
          >
            📂 Main Repository
          </Button>
          <Button
            variant="outlined"
            href={`https://github.com/${OWNER}/${REPO}/tree/main/shared-resources`}
            target="_blank"
          >
            📚 Shared Resources
          </Button>
          <Button
            variant="outlined"
            href={`https://github.com/${OWNER}/${REPO}/blob/main/README.md`}
            target="_blank"
          >
            📖 Documentation
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default App
