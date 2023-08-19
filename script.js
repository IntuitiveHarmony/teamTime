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

// Toggle menu
let menuOpen = true;
const toggleMenu = () => {
  if (menuOpen) {
    $(".x-icon").removeClass("hide");
    $(".bars-icon").addClass("hide");
    $(".team-link").removeClass("hide");
    menuOpen = false;
  } else {
    $(".x-icon").addClass("hide");
    $(".bars-icon").removeClass("hide");
    $(".team-link").addClass("hide");
    menuOpen = true;
  }
};

const showTeamModal = () => {
  $(".team-modal").removeClass("hide");
  $(".add-team").addClass("hide");
};
const hideTeamModal = () => {
  $(".team-modal").addClass("hide");
  $(".add-team").removeClass("hide");
  $(".team-validate").addClass("hide");
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
    // console.log(existingTeams[i]);
  }
  // console.log(existingTeams);
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

  // Menu Button
  $(".menu").click(toggleMenu);
  // Team Buttons
  $(".add-team").click(showTeamModal);
  $(".cancel-team").click(hideTeamModal);
  $(".submit-team").click(submitTeam);
  $(".generate-team").click(generateTeamName);
});
