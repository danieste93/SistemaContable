import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(to bottom right, #f8a8a8, #92d2f7)",
  },
  mainText: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "32px",
  },
  buttonContainer: {
    display: "flex",
  },
  redButton: {
    backgroundColor: "#ff3b3f",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    marginRight: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#c90003",
    },
  },
  blueButton: {
    backgroundColor: "#3b8eff",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#0c56be",
    },
  },
}));

const Hero = () => {
  const classes = useStyles();

  return (
    <Box className={classes.hero}>
      <h1 className={classes.mainText}>We Solve Everything</h1>
      <div className={classes.buttonContainer}>
        <Button className={classes.redButton}>Red Button</Button>
        <Button className={classes.blueButton}>Blue Button</Button>
      </div>
    </Box>
  );
};

export default Hero;