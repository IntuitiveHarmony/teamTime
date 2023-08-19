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

const addTeam = () => {
  $(".team-modal").css("display", "block");
  $(".add-team").css("display", "none");
  const team = {
    name: "",
    members: [],
  };
  localStorage.setItem(`Teams: ${team}: `, JSON.stringify(team));
  // console.log(team);
};

const cancelTeam = () => {
  $(".team-modal").css("display", "none");
  $(".add-team").css("display", "initial");
};

$(() => {
  // Update the time immediately when the page loads
  updateLocalTime();
  // Update the time every second
  setInterval(updateLocalTime, 1000);

  // Team Buttons
  $(".add-team").click(addTeam);
  $(".cancel-team").click(cancelTeam);
});
