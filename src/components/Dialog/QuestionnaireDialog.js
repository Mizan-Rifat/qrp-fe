import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Box, CircularProgress, IconButton, InputAdornment, Typography } from '@material-ui/core';
import Parse from 'parse';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Snackbar from 'components/Snackbar/Snackbar.js';
import { useDispatch, useSelector } from 'react-redux';
import { userUpdated } from 'redux/ducks/userDuck';
import { fetchQuestionnaire, resetQuestionnaireState } from 'redux/ducks/questionnaireDuck';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  disable: {
    pointerEvents: 'none',
    opacity: 0.5
  },
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

let otherQuestions = [
  { label: 'Are you legally eligible to work in Canada?', key: 'question1' },
  { label: 'Are you at least 16 years old?', key: 'question2' },
  {
    label:
      'Have you ever been convicted of a felony or been charged with a criminal offence for which a pardon has not been granted?',
    key: 'question3'
  },
  {
    label: 'Do you have at least 1 year experience as a Pharmacy Assistant in Canada?',
    key: 'question4'
  },
  {
    label:
      'Do you have a valid liability insurance as required by your provincial licensing authority?',
    key: 'question5'
  },
  {
    label:
      'Is your license currently registered as active with your provincial pharmacy licensing authority and is in good standing?',
    key: 'question6'
  },
  {
    label:
      'Have you ever had your provincial pharmacy license restricted, suspended or revoked by your provincial licensing authority?',
    key: 'question7'
  },
  {
    label:
      'Have you ever been found guilty of professional malpractice, misconduct, or incapacitated by your provincial licensing authority?',
    key: 'question8'
  }
];
let pharmacistQuestions = [
  { label: 'Are you legally eligible to work in Canada?', key: 'question1' },
  { label: 'Are you registered with The Ontario Drug Benefit (ODB) Program?', key: 'question2' },
  {
    label:
      'Have you ever been convicted of a felony or been charged with a criminal offence for which a pardon has not been granted?',
    key: 'question3'
  },
  {
    label:
      'Do you have a valid liability insurance as required by your provincial licensing authority?',
    key: 'question4'
  },
  {
    label:
      'Is your license currently registered as active with your provincial pharmacy licensing authority and is in good standing?',
    key: 'question5'
  },
  {
    label:
      'Have you ever had your provincial pharmacy license restricted, suspended or revoked by your provincial licensing authority?',
    key: 'question6'
  },
  {
    label:
      'Have you ever been found guilty of professional malpractice, misconduct, or incapacitated by your provincial licensing authority?',
    key: 'question7'
  }
];

export default function QuestionnaireDialog({ user, parseUser, open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  const [questions, setQuestions] = useState([]);

  const { questionnaire, fetching } = useSelector(state => state.questionnaire);

  const dispatch = useDispatch();

  useEffect(() => {
    if (questionnaire.length > 0) {
      let selectedQuestions;
      if (user.roles.some(role => role.get('name') === 'Other')) {
        selectedQuestions = otherQuestions;
      }
      if (user.roles.some(role => role.get('name') === 'Pharmacist')) {
        selectedQuestions = pharmacistQuestions;
      }
      const questions = selectedQuestions.map(question => {
        let answer = questionnaire.find(ques => ques.question === question.key).answer;
        return {
          ...question,
          answer
        };
      });

      setQuestions(questions);
    }
  }, [questionnaire]);

  useEffect(() => {
    dispatch(fetchQuestionnaire(parseUser));
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Questionnaire
        </DialogTitle>
        <DialogContent dividers style={{ minHeight: 250 }}>
          {fetching ? (
            <Box position="absolute" top="50%" left="47%">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {questions.length > 0 ? (
                questions.map(question => (
                  <Box mb={1}>
                    <h6 style={{ margin: 0, textTransform: 'unset' }}>
                      <span style={{ fontWeight: 400, textTransform: 'capitalize' }}>
                        Question :
                      </span>{' '}
                      {question.label}
                    </h6>
                    <p style={{ margin: 0 }}>
                      <span style={{ fontWeight: 400 }}>Answer : </span>
                      {question.answer}
                    </p>
                  </Box>
                ))
              ) : (
                <Box textAlign="center">No questionnaire found.</Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const DialogTitle = props => {
  const classes = useStyles();
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};
