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
// Time Zone API Functions
// https://ipgeolocation.io/documentation/timezone-api.html
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const callAPI = () => {
  const key = process.env.API_KEY;
  const location = $("#member-location").val();

  const URL = `https://api.ipgeolocation.io/timezone?apiKey=${key}&location=${location}`;
  console.log(URL);
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Time Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getTime = () => {
  const currentTime = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
    timeZoneName: "short",
  };
  return currentTime.toLocaleTimeString(undefined, options);
};

const updateLocalTime = () => {
  $(".local-time").text(getTime);
};

// const getTeamTime = (gmtOffset) => {
//   console.log(gmtOffset);
//   // Get the current UTC time
//   const currentUtcTime = new Date();

//   // Calculate the GMT time using the offset
//   const gmtTime = new Date(currentUtcTime.getTime() + gmtOffset * 3600000); // Convert hours to milliseconds

//   // Format and display the time
//   const formattedTime = gmtTime.toISOString().replace("T", " ").substr(0, 19);
//   console.log(
//     `The current time in GMT${
//       gmtOffset > 0 ? "+" : ""
//     }${gmtOffset}: ${formattedTime}`
//   );
// };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// About Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const showAbout = () => {
  console.log("about");
  hideTeamModal();
  hideMemberModal();
  hideTeamShow();
  hideTeams();
  $("#about-card").removeClass("hide");
};

const hideAbout = () => {
  $("#about-card").addClass("hide");
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
  hideTeamShow();
  hideAbout();
  hideMemberModal();
  hideTeams();
  $(".team-modal").removeClass("hide");
  $(".teams-container").addClass("hide");
};

const hideTeamModal = () => {
  displayTeams();
  $(".team-modal").addClass("hide");
  $(".team-validate").addClass("hide");
  $("#team-name").val("");
};

const showTeams = () => {
  displayTeams();
  hideAbout();
  hideTeamModal();
  hideMemberModal();
  $(".team-show-container").addClass("hide");
};
const hideTeamShow = () => {
  $(".team-show-container").addClass("hide");
};

const hideTeams = () => {
  $(".teams-container").addClass("hide");
};

const displayTeams = () => {
  $(".teams-container").removeClass("hide");
  const transaction = db.transaction([DB_STORE_NAME], "readonly");
  const store = transaction.objectStore(DB_STORE_NAME);
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = () => {
    const teams = getAllRequest.result;
    // check if there are teams in the db first
    if (teams.length > 0) {
      writeTeamsToDOM(teams);
      $(".teams-message").addClass("hide");
    } else {
      $(".teams-message").removeClass("hide");
    }
  };
};

const writeTeamsToDOM = (teams) => {
  // make sure teams don't stack
  $(".teams-index").empty();

  // Loop that lays down the team buttons
  for (let i = 0; i < teams.length; i++) {
    const teamName = teams[i].name;
    const teamMembers = teams[i].members;
    const newLi = $("<li>")
      .addClass("team-button secondary-card link")
      .attr("id", `team-${i}`);
    const nameContainer = $("<div>")
      .addClass("team-name-container")
      .text(`${teamName}`)
      .appendTo(newLi);
    const memberContainer = $("<div>")
      .addClass("team-member-container")
      .text(`Members: ${teams[i].members.length}`)
      .appendTo(newLi);
    $(".teams-index").append(newLi);
    // Single out team's onClick for "Show View"
    $(`#team-${i}`).on("click", () => {
      writeMembersToDOM(teams[i].id);
      $(".team-show-container").removeClass("hide");
      $(".teams-container").addClass("hide");
      // Pass index to the show page
      $(".team-header").text(teamName).attr("index-id", teams[i].id);
    });
  }
};

// Add new Team Names
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

// This puts new member into the DB
const addMemberToTeam = (teamId, newMember) => {
  console.log(`From addMemberToTeam ${teamId}`, newMember);
  // Start a readwrite transaction on the IndexedDB
  const transaction = db.transaction([DB_STORE_NAME], "readwrite");
  const store = transaction.objectStore(DB_STORE_NAME);

  // Get team from IndexedDB
  const getRequest = store.get(teamId);
  getRequest.onsuccess = (event) => {
    const team = event.target.result;

    // Update the team's members array
    team.members.push(newMember);

    // Update the team in IndexedDB with the modified 'members' array
    const updateRequest = store.put(team);

    updateRequest.onsuccess = () => {
      writeMembersToDOM(teamId);
      console.log("Member added to team");
      // Perform any further actions after adding the member
    };
    updateRequest.onerror = (event) => {
      console.log("Error updating team with new member:", event.target.error);
    };
  };
  getRequest.onerror = (event) => {
    console.log("Error fetching team:", event.target.error);
  };
};

const submitMember = () => {
  // Grab the team index, it is a string from the HTML the DB needs an int
  const teamId = parseInt($(".team-header").attr("index-id"));

  const newMember = {
    name: $("#member-name").val(),
    location: $("#member-location").val(),
    gmtOffset: parseInt($("#timezone-offset").val()),
  };

  addMemberToTeam(teamId, newMember);

  cancelMember();
};

const writeMembersToDOM = (teamId) => {
  const transaction = db.transaction([DB_STORE_NAME], "readonly");
  const store = transaction.objectStore(DB_STORE_NAME);
  const getRequest = store.get(teamId);

  getRequest.onsuccess = (event) => {
    const container = $(".member-container");
    container.empty();
    const members = event.target.result.members;
    for (let i = 0; i < members.length; i++) {
      getTeamTime(members[i].gmtOffset);

      const memberCard = $("<li>")
        .addClass("member-card")
        .text(`${members[i].name} - ${members[i].location} - `)
        .appendTo(container);

      console.log(members[i].name);
    }
  };
};

// may not need to do this
const updateFooterPosition = () => {
  const contentHeight = $("body").height();
  const windowHeight = $(window).height();
  const footerHeight = $(".footer").outerHeight();

  if (contentHeight + footerHeight < windowHeight) {
    $(".footer").css({
      position: "fixed",
      bottom: 0,
    });
  } else {
    $(".footer").css({
      position: "relative",
      bottom: "auto",
    });
  }
};

$(() => {
  // Update the time immediately when the page loads
  updateLocalTime();
  // Update the time every second
  setInterval(updateLocalTime, 1000);

  // About Buttons
  $(".about").click(showAbout);

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
  $("#location-search-btn").click(callAPI);

  // Update footer position on page load and when the window is resized
  updateFooterPosition();
  $(window).on("resize", updateFooterPosition);
});
