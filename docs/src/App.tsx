import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink
} from "@mui/material";

const GITHUB_API_BASE = "https://api.github.com";
const OWNER = "rogerjs93";
const REPO = "Seminar-Core-Competences-2025";
const ASSIGNMENTS = ["assignment1", "assignment2", "assignment3", "assignment4", "assignment5"];

type Submission = {
  name: string;
  files: string[];
  notes: string | null;
};

function fetchAssignmentFolders(assignment: string): Promise<Submission[]> {
  // List folders in the assignment directory
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

  useEffect(() => {
    fetchAssignmentFolders(assignment).then(setSubs);
  }, [assignment]);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary">
          {assignment.replace("assignment", "Assignment ")}
        </Typography>
        <Box mt={2}>
          {subs === null ? (
            <CircularProgress size={24} />
          ) : (
            <List>
              {subs.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No submissions yet." />
                </ListItem>
              ) : (
                subs.map((s) => (
                  <ListItem key={s.name} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <strong>
                          <span role="img" aria-label="folder">
                            📁
                          </span>{" "}
                          {s.name}
                        </strong>
                      }
                      secondary={
                        <>
                          {s.files.map((f) => (
                            <span key={f}>
                              <MuiLink
                                href={`https://github.com/${OWNER}/${REPO}/blob/main/${assignment}/${s.name}/${f}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                📄 {f}
                              </MuiLink>{" "}
                            </span>
                          ))}
                          {s.notes && (
                            <span>
                              {" | "}
                              <MuiLink
                                href={`https://github.com/${OWNER}/${REPO}/blob/main/${assignment}/${s.name}/notes.md`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                📝 notes
                              </MuiLink>
                            </span>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

function App() {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Seminar Core Competences 2025
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Anonymous &amp; optional student assignment portal.
      </Typography>
      <Box mb={4}>
        <Typography variant="body1">
          <strong>How to submit:</strong> Create a folder for yourself using any pseudonym in any assignment directory, upload your work, and optionally add a notes.md for feedback! See repo <MuiLink href="https://github.com/rogerjs93/Seminar-Core-Competences-2025" target="_blank">README</MuiLink> for full rules.
        </Typography>
      </Box>
      {ASSIGNMENTS.map((a) => (
        <AssignmentCard assignment={a} key={a} />
      ))}
      <Box mt={6} mb={2} textAlign="center">
        <Typography variant="caption" color="text.secondary">
          Powered by GitHub Pages &middot; UI updates automatically as assignments are added!
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
