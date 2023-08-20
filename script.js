// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Database Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
if (!("indexedDB" in window)) {
  console.log("This browser doesn't support IndexedDB");
}

// Database Variables
const DB_NAME = "teamsData";
const DB_VERSION = 1;
const DB_STORE_NAME = "teams";

let db;

// Request to open new IndexDB instance
let request = indexedDB.open(DB_NAME, DB_VERSION);

request.onsuccess = (event) => {
  // console.log("IndexDB opened Successfully");
  db = event.target.result;
  // once connected display the teams
  displayTeams();
};

// This event is triggered when the database version changes or is created
// Index DB's schema
request.onupgradeneeded = (event) => {
  console.log("Running Upgrade needed");
  db = event.target.result;
  // Create an object store called "contacts" with auto-incrementing keys
  const storeOS = db.createObjectStore(DB_STORE_NAME, {
    keyPath: "id",
    autoIncrement: true,
  });
  // Create an index called "name" for searching contacts by name
  storeOS.createIndex("name", "name", { unique: true });
};

// Event handler for database connection errors
request.onerror = (event) => {
  console.error("Database error:", event.target.error);
};

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

const displayTeams = () => {
  console.log("display teams");
  const transaction = db.transaction([DB_STORE_NAME], "readonly");
  const store = transaction.objectStore(DB_STORE_NAME);
  const countRequest = store.count();

  let teamCount;

  countRequest.onsuccess = () => {
    teamCount = countRequest.result;
    console.log(teamCount);
  };

  // make sure teams don't stack
  // $(".teams-index").empty();
  // const teamsJSON = localStorage.getItem("teams");
  // const existingTeams = JSON.parse(teamsJSON);
  // // Loop that lays down the team buttons
  // for (let i = 0; i < existingTeams.length; i++) {
  //   const teamName = existingTeams[i].name;
  //   const teamMembers = existingTeams[i].members;
  //   const newTimeCard = $("<li>")
  //     .addClass("team-button")
  //     .attr("id", `team-${i}`);
  //   const nameContainer = $("<div>")
  //     .addClass("team-name-container")
  //     .text(`${teamName}`)
  //     .appendTo(newTimeCard);
  //   const memberContainer = $("<div>")
  //     .addClass("team-member-container")
  //     .text(`Members: ${existingTeams[i].members.length}`)
  //     .appendTo(newTimeCard);
  //   $(".teams-index").append(newTimeCard);
  //   // Single out individual team's onClick
  //   // "Show View" for each team
  //   $(`#team-${i}`).on("click", () => {
  //     console.log(teamMembers);
  //     $(".team-show-container").removeClass("hide");
  //     $(".teams-container").addClass("hide");
  //     // Pass index to the show page
  //     $(".team-header").text(teamName).attr("index", i);
  //   });
  // }
};

const submitTeam = () => {
  // Use the db object directly to interact with IndexedDB
  const transaction = db.transaction([DB_STORE_NAME], "readwrite");
  const store = transaction.objectStore(DB_STORE_NAME);

  // Grab team name from the form
  const newTeam = {
    name: $("#team-name").val(),
    members: [],
  };

  // Validate Team Name: display warning if empty name field
  if (newTeam.name) {
    //  Add the new team to the IndexedDB object store
    const addRequest = store.add(newTeam);
    addRequest.onsuccess = () => {
      hideTeamModal();
      displayTeams();
    };
  } else {
    $(".team-validate").css("display", "inline-block");
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Member Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const hideMemberModal = () => {
  $("#add-member").removeClass("hide");
  $(".member-modal").addClass("hide");
};

const showMemberModal = () => {
  $("#add-member").addClass("hide");
  $(".member-modal").removeClass("hide");
};

const cancelMember = () => {
  hideMemberModal();
  $("#member-name").val("");
  $("#member-location").val("");
};

const submitMember = () => {
  // Grab the team index
  const index = $(".team-header").attr("index");

  const teamsJSON = localStorage.getItem("teams");
  const existingTeams = JSON.parse(teamsJSON);
  console.log(existingTeams[index]);
  const existingMembers = existingTeams[index].members;

  const newMember = {
    name: $("#member-name").val(),
    location: $("#member-location").val(),
    timeZone: $("#timezone-offset").val(),
  };

  console.log(existingMembers);
  console.log(newMember);
  hideMemberModal();
};

$(() => {
  // Update the time immediately when the page loads
  updateLocalTime();
  // Update the time every second
  setInterval(updateLocalTime, 1000);

  // Team Buttons
  $("#add-team").click(showTeamModal);
  $("#show-teams").click(showTeams);
  $(".cancel-team").click(hideTeamModal);
  $(".submit-team").click(submitTeam);
  $(".generate-team").click(generateTeamName);

  // Member Buttons
  $("#add-member").click(showMemberModal);
  $("#cancel-member").click(cancelMember);
  $("#submit-member").click(submitMember);
});
