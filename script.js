// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Time Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Team Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Generate Names
const nouns = [
  "Dogs",
  "Cats",
  "Elephants",
  "Lions",
  "Giraffes",
  "Monkeys",
  "Dolphins",
  "Tigers",
  "Penguins",
  "Kangaroos",
  "Koalas",
  "Octopi",
  "Zebras",
  "Rhinos",
  "Cheetahs",
  "Foxes",
  "Owls",
  "Bears",
  "Rabbits",
  "Hippos",
  "Peacocks",
  "Sharks",
  "Crocodiles",
  "Butterflies",
  "Seahorses",
  "Platypi",
  "Chimpanzees",
  "Pandas",
  "Horses",
  "Llamas",
  "Camels",
  "Hedgehogs",
  "Sloths",
  "Raccoons",
  "Flamingos",
  "Parrots",
  "Orangutans",
  "Snails",
  "Walruses",
  "Alpacas",
];
const adjectives = [
  "Zany",
  "Whimsical",
  "Goofy",
  "Bizarre",
  "Quirky",
  "Wacky",
  "Ludicrous",
  "Absurd",
  "Ridiculous",
  "Hilarious",
  "Nutty",
  "Bonkers",
  "Silly",
  "Dippy",
  "Loony",
  "Offbeat",
  "Far-out",
  "Funky",
  "Outlandish",
  "Kooky",
  "Peculiar",
  "Flaky",
  "Wackadoo",
  "Unconventional",
  "Daft",
  "Nonsensical",
  "Preposterous",
  "Whacky",
  "Eccentric",
  "Cuckoo",
  "Batty",
  "Daffy",
  "Absurd",
  "Bunkers",
  "Freaky",
  "Kookaburra",
  "Bananas",
  "Cockamamie",
  "Dippy",
  "Screwball",
];

const generateTeamName = () => {
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];

  $("#team-name").val(`${randomAdjective} ${randomNoun}`);
};

const showTeamModal = () => {
  hideMemberModal();
  hideTeams();
  $(".team-modal").removeClass("hide");
  $(".teams-container").addClass("hide");
};

const hideTeamModal = () => {
  $(".team-modal").addClass("hide");
  $(".team-validate").addClass("hide");
  $("#team-name").val("");
};

const showTeams = () => {
  hideTeamModal();
  hideMemberModal();
  $(".teams-container").removeClass("hide");
  $(".team-show-container").addClass("hide");
};

const hideTeams = () => {
  $(".team-show-container").addClass("hide");
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
  // make sure teams don't stack
  $(".teams-index").empty();

  const teamsJSON = localStorage.getItem("teams");
  const existingTeams = JSON.parse(teamsJSON);
  // Loop that lays down the team buttons
  for (let i = 0; i < existingTeams.length; i++) {
    const teamName = existingTeams[i].name;
    const teamMembers = existingTeams[i].members;

    const newTimeCard = $("<li>")
      .addClass("team-button")
      .attr("id", `team-${i}`);
    const nameContainer = $("<div>")
      .addClass("team-name-container")
      .text(`${teamName}`)
      .appendTo(newTimeCard);
    const memberContainer = $("<div>")
      .addClass("team-member-container")
      .text(`Members: ${existingTeams[i].members.length}`)
      .appendTo(newTimeCard);
    $(".teams-index").append(newTimeCard);
    // Single out individual team's onClick
    // "Show View" for each team
    $(`#team-${i}`).on("click", () => {
      console.log(teamMembers);
      $(".team-show-container").removeClass("hide");
      $(".teams-container").addClass("hide");
      $(".team-header").text(teamName);
    });
  }
};

const submitTeam = () => {
  const teamsJSON = localStorage.getItem("teams");
  const existingTeams = JSON.parse(teamsJSON);
  const newTeam = {
    name: $("#team-name").val(),
    members: [],
  };
  const updatedTeams = [...existingTeams, newTeam];
  // Validate Team Name: display warning if empty name field
  if (newTeam.name) {
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    showTeams();
  } else {
    $(".team-validate").css("display", "inline-block");
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Member Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const hideMemberModal = () => {
  $(".member-modal").addClass("hide");
};

const showMemberModal = () => {
  $(".member-modal").removeClass("hide");
};

$(() => {
  initLocalStorage();
  // Update the time immediately when the page loads
  updateLocalTime();
  // Update the time every second
  setInterval(updateLocalTime, 1000);

  displayTeams();

  // Team Buttons
  $("#add-team").click(showTeamModal);
  $("#show-teams").click(showTeams);
  $(".cancel-team").click(hideTeamModal);
  $(".submit-team").click(submitTeam);
  $(".generate-team").click(generateTeamName);

  // Member Buttons
  $("#add-member").click(showMemberModal);
});
