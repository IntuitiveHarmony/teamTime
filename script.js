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
};

const submitTeam = () => {
  const team = {
    name: $("#team-name").val(),
    members: [],
  };
  if (team.name) {
    localStorage.setItem(`Teams: ${team}: `, JSON.stringify(team));
    console.log(team);
    hideTeamModal();
  } else {
    $(".team-validate").css("display", "inline-block");
  }
};

$(() => {
  // Update the time immediately when the page loads
  updateLocalTime();
  // Update the time every second
  setInterval(updateLocalTime, 1000);

  // Team Buttons
  $(".add-team").click(showTeamModal);
  $(".cancel-team").click(hideTeamModal);
  $(".submit-team").click(submitTeam);
});
