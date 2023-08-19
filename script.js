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
  const team = {
    name: "Test Team",
    members: [
      {
        name: "Jason",
        location: "Denver",
        timeZone: "",
      },
      {
        name: "Harley",
        location: "Dream Land",
        timeZone: "",
      },
    ],
  };
  localStorage.setItem(`Team: ${team}: `, JSON.stringify(team));
  console.log(team);
};

$(() => {
  // Update the time immediately when the page loads
  updateLocalTime();
  // Update the time every second
  setInterval(updateLocalTime, 1000);

  // Add Member Button
  $(".add-member").click(addTeam);
});
