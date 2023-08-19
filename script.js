const getTime = () => {
  const currentTime = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  return currentTime.toLocaleTimeString(undefined, options);
};

const updateLocalTime = () => {
  $(".local-time").text(getTime);
};

const showTeamModal = () => {
  $(".team-modal").css("display", "block");
  $(".add-team").css("display", "none");
};
const hideTeamModal = () => {
  $(".team-modal").css("display", "none");
  $(".add-team").css("display", "block");
  $(".team-validate").css("display", "none");
  $("#team-name").val("");
  displayTeams();
};

// Hacking local storage for storing teams into empty array
const initLocalStorage = () => {
  const existingTeams = localStorage.getItem("teams");
  if (!existingTeams) {
    const emptyArray = [];
    localStorage.setItem("teams", JSON.stringify(emptyArray));
  }
};

const displayTeams = () => {
  $(".teams-index").empty();
  const teamsJSON = localStorage.getItem("teams");
  const existingTeams = JSON.parse(teamsJSON);
  for (let i = 0; i < existingTeams.length; i++) {
    const newTimeCard = $("<li>")
      .addClass("team-button")
      .text(`${i + 1}:  ${existingTeams[i].name}`);
    $(".teams-index").append(newTimeCard);
    console.log(existingTeams[i]);
  }
  console.log(existingTeams);
};

const submitTeam = () => {
  const teamsJSON = localStorage.getItem("teams");
  const existingTeams = JSON.parse(teamsJSON);
  const newTeam = {
    name: $("#team-name").val(),
    members: [],
  };
  const updatedTeams = [...existingTeams, newTeam];
  console.log(updatedTeams);
  // Validate Team Name: display warning if empty name field
  if (newTeam.name) {
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    hideTeamModal();
  } else {
    $(".team-validate").css("display", "inline-block");
  }
};

$(() => {
  initLocalStorage();
  // Update the time immediately when the page loads
  updateLocalTime();
  // Update the time every second
  setInterval(updateLocalTime, 1000);

  displayTeams();

  // Team Buttons
  $(".add-team").click(showTeamModal);
  $(".cancel-team").click(hideTeamModal);
  $(".submit-team").click(submitTeam);
});
