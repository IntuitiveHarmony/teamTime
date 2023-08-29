// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Database Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
if (!("indexedDB" in window)) {
  console.log("This browser doesn't support IndexedDB");
}

// Team Database Variables
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

// User db stuff
const DB_USER_NAME = "userData";
const DB_USER_VERSION = 1;
const DB_USER_STORE_NAME = "user";

let userDB;

const userRequest = indexedDB.open(DB_USER_NAME, DB_USER_VERSION);

userRequest.onsuccess = (event) => {
  userDB = event.target.result;

  // Get users timezone data into db to use later for comparisons
  updateUserDb();
};

userRequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  const userStore = db.createObjectStore(DB_USER_STORE_NAME, {
    keyPath: "id",
    autoIncrement: true,
  });
};

userRequest.onerror = (event) => {
  console.error("User database error:", event.target.error);
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// UserDB Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const addUserToDb = (userData) => {
  const transaction = userDB.transaction([DB_USER_STORE_NAME], "readwrite");
  const store = transaction.objectStore(DB_USER_STORE_NAME);

  const addUserRequest = store.add(userData);

  addUserRequest.onsuccess = () => {
    // console.log("User data added to database");
  };

  addUserRequest.onerror = (event) => {
    console.error("Error adding user data to database:", event.target.error);
  };
};

const updateExistingUserInDb = (userData) => {
  const transaction = userDB.transaction([DB_USER_STORE_NAME], "readwrite");
  const store = transaction.objectStore(DB_USER_STORE_NAME);

  const addUserRequest = store.put(userData);

  addUserRequest.onsuccess = () => {
    // console.log("User data updated in database");
  };

  addUserRequest.onerror = (event) => {
    console.error("Error updating user data in database:", event.target.error);
  };
};

// checks to see if there is user timezone in db, compare to local tz and adjust user db accordingly
const updateUserDb = () => {
  // connect to user db and request tz info
  const transaction = userDB.transaction([DB_USER_STORE_NAME], "readonly");
  const store = transaction.objectStore(DB_USER_STORE_NAME);
  // get the user object
  const getUserDataRequest = store.get("user");

  // Get local tz info
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  getUserDataRequest.onsuccess = async (event) => {
    const user = event.target.result;

    if (!user) {
      // User does not exist yet
      // console.log("no user timezone");

      // create a new user with local time zone info from api
      addUserToDb(await getUpdatedTimezoneInfo(localTimezone));
    } else {
      // User exists now check if the local timezone is accurate
      const storedTimezone = user.timezone;
      // update the user db if the local time zone is different
      if (storedTimezone !== localTimezone) {
        // update user with local time zone info from api
        updateExistingUserInDb(await getUpdatedTimezoneInfo(localTimezone));

        // ~~~ Leaving this in to help debug in the future ~~~~~
        // console.log("Db and local timezone are not the same");
      }
      // ~~~ These were pretty helpful when debugging ~~~~~~~~~~
      // else {
      //   console.log("Db and local timezone are the same");
      // }
      // console.log("Local time zone:", localTimezone);
      // console.log("Db time zone:", storedTimezone);
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
  };
};

const getUpdatedTimezoneInfo = async (localTimezone) => {
  // call the Api
  const response = await axios.post("/timeApiTz", { localTimezone });

  return {
    id: "user",
    timezone: response.data.timezone,
    timezone_offset: response.data.timezone_offset,
    is_dst: response.data.is_dst,
    dst_savings: response.data.dst_savings,
    last_update: response.data.date_time_txt,
  };
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Time Zone API Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const callAPI = async () => {
  validateMemberForm();
  // clear any existing searches
  $(".response-data").empty();
  // get info from form
  const location = $("#member-location").val();
  // show the spinner instead of button
  $("#location-search-loading").removeClass("hide");
  $("#location-search-btn").addClass("hide");

  try {
    // make the call
    const response = await axios.post("/timeApi", { location });
    // This where the times get compared for the confirmation
    const dataUnixStamp = response.data.date_time_unix;
    const unixTimestampMillis = dataUnixStamp * 1000;

    const dateObject = new Date(unixTimestampMillis);

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Months are 0-based, so add 1
    const day = dateObject.getDate();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    console.log(`Date: ${year}-${month}-${day}`);
    console.log(`Time: ${hours}:${minutes}`);

    // const currentTimestamp = Math.floor(Date.now() / 1000); // Get the current Unix timestamp in seconds
    // const timeDiff = currentTimestamp - dataUnixStamp;
    // console.log(timeDiff);
    // const minutes = Math.floor((timeDiff / 60) % 60);
    // const hours = Math.floor((timeDiff / 3600) % 24);

    let dstBool = false;

    if (response.data.dst_savings) {
      dstBool = true;
    }

    const $cell1 = $(`<td colspan="2">`)
      .addClass("timezone-data")
      .text(`Did you mean: ${response.data.timezone}?\n`)
      .appendTo(".response-data");
    const $cell2 = $(`<td colspan="2">`)
      .addClass("timezone-data")
      .text(
        `Current Time: ${response.data.time_12} - Local offset ${hours}:${minutes} - Observe DST: ${dstBool} \n`
      )
      .appendTo(".response-data");

    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Remove grey from button
    $("#submit-member").removeClass("disabled");
    // Show button instead of spinner
    $("#location-search-loading").addClass("hide");
    $("#location-search-btn").removeClass("hide");
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Time Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getTime = () => {
  const currentTime = new Date();
  const unixTimestamp = Math.floor(currentTime.getTime() / 1000);
  // console.log(unixTimestamp);
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
const generateTeamName = async () => {
  // Get list from other file
  const response = await axios.get("/lists");
  const nouns = response.data.nouns;
  const adjectives = response.data.adjectives;

  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];

  $("#team-name").val(`${randomAdjective} ${randomNoun}`);
  validateTeamForm();
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
  $("#add-team-btn").addClass("disabled");
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
    const menuContainer = $("<div>")
      .addClass("team-menu-container")
      .appendTo(newLi);
    // Delete team Button
    const delBtn = $("<i>")
      .addClass("fa-solid fa-x team-del")
      .appendTo(menuContainer)
      .on("click", (event) => {
        event.stopPropagation(); // Keeps the show page from opening too
        const confirmDelete = confirm(
          `Are you sure you want to delete ${teams[i].name}?`
        );
        if (confirmDelete) {
          deleteTeam(teams[i].id);
        }
      });

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

const deleteTeam = (teamId) => {
  // Open a transaction in "readwrite" mode
  const transaction = db.transaction([DB_STORE_NAME], "readwrite");
  const store = transaction.objectStore(DB_STORE_NAME);

  // Delete the team using its ID
  const deleteRequest = store.delete(teamId);

  deleteRequest.onsuccess = () => {
    // console.log("Team deleted successfully");

    displayTeams();
  };

  deleteRequest.onerror = (event) => {
    console.error("Error deleting team:", event.target.error);
  };
};

// validate the team
const validateTeamForm = () => {
  $(".team-validate").addClass("hide");
  const teamName = $("#team-name").val();

  if (!teamName) {
    $("#add-team-btn").addClass("disabled");
    $(".team-validate").removeClass("hide");
    return false;
  } else {
    $("#add-team-btn").removeClass("disabled");
    $(".team-validate").addClass("hide");
    return true;
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
  if (validateTeamForm()) {
    //  Add the new team to the IndexedDB object store
    const addRequest = store.add(newTeam);
    addRequest.onsuccess = () => {
      hideTeamModal();
      displayTeams();
    };
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Member Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const hideMemberModal = () => {
  $("#member-name-warning").addClass("hide");
  $("#member-location-warning").addClass("hide");
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

const validateMemberForm = () => {
  const name = $("#member-name").val();
  const location = $("#member-location").val();
  // Clear warnings first
  $("#member-name-warning").addClass("hide");
  $("#member-location-warning").addClass("hide");

  if (!name && !location) {
    // If both fields are empty
    $("#member-name-warning").removeClass("hide");
    $("#member-location-warning").removeClass("hide");
    return false;
  } else if (!name) {
    // If only the name field is empty
    $("#member-name-warning").removeClass("hide");
    return false;
  } else if (!location) {
    // If only the location field is empty
    $("#member-location-warning").removeClass("hide");
    return false;
  } else {
    // If both fields are filled
    return true;
  }
};

const submitMember = () => {
  // start with button greyed out
  $("#submit-member").addClass("disabled");
  // Grab the team index, it is a string from the HTML the DB needs an int
  const teamId = parseInt($(".team-header").attr("index-id"));

  const name = $("#member-name").val();
  const location = $("#member-location").val();

  // validate Name in form
  if (validateMemberForm()) {
    const newMember = {
      name: name,
      location: $("#member-location").val(),
      gmtOffset: parseInt($("#timezone-offset").val()),
    };

    addMemberToTeam(teamId, newMember);
    cancelMember();
  }
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
      // getTeamTime(members[i].gmtOffset);

      const memberCard = $("<li>")
        .addClass("member-card")
        .text(`${members[i].name} - ${members[i].location} - `)
        .appendTo(container);

      // console.log(members[i].name);
    }
  };
};

$(() => {
  // Update the time immediately when the page loads
  updateLocalTime();
  // Update the time every second
  setInterval(updateLocalTime, 1000);

  // Add a keydown event listener to the input fields within the form
  $("#member-location").keydown((event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission behavior
      callAPI(); // Call the API function
    }
  });
  // this is here so it doesn't bind to the element and render multiple searches
  $("#location-form").submit(async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    await callAPI(); // Call the API function
  });

  // Validate the forms as they are updated by user
  $("#team-name").on("input", validateTeamForm);
  $("#member-name").on("input", validateMemberForm);
  $("#member-location").on("input", validateMemberForm);

  // About Buttons
  // Has to grab the class cuz there are two links to about
  $(".about").click(showAbout);

  // Team Buttons
  $("#add-team").click(showTeamModal);
  $("#show-teams").click(showTeams);
  $("#cancel-team").click(hideTeamModal);
  $("#add-team-btn").click(submitTeam);
  $("#generate-team").click(generateTeamName);

  // Member Buttons
  $("#add-member").click(showMemberModal);
  $("#cancel-member").click(cancelMember);
  $("#submit-member").click(submitMember);
});
