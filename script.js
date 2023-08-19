$(() => {
  const updateLocalTime = () => {
    const currentTime = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",

      timeZoneName: "long",
    };
    const formattedTime = currentTime.toLocaleTimeString(undefined, options);
    $(".local-time").text(formattedTime);
  };

  // Update the time immediately when the page loads
  updateLocalTime();

  // Update the time every second
  setInterval(updateLocalTime, 1000);
});
