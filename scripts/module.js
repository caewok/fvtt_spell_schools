Hooks.once('init', setup);


let dnd_default_schools = {};

Hooks.once('ready', async function() {
  console.log('spell-schools | Readying Spell Schools module');
  //console.log(game.dnd5e.config.spellSchools);  
  
    
  await addSpellSchools();
});

async function setup() {
    // game.dnd5e.config.spellSchools not yet localized. 
    console.log('spell-schools | Initializing Spell Schools module');
    //console.log(game.dnd5e.config.spellSchools);
    dnd_default_schools = JSON.parse(JSON.stringify(game.dnd5e.config.spellSchools));
    await registerSpellSchoolsSettings();
    await addSpellSchools(true);
}

function registerSpellSchoolsSettings() {
    game.settings.register("spell-schools", "schools", {
        name: "Spell Schools to Add",
        hint: "Add the names of additional spell schools separated by commas. Schools should not repeat nor repeat existing DnD schools.",
        scope: "world",
        config: true,
        type: String,
        default: "",
        onChange: addSpellSchools
    });
}

/** 
 * Test if an array contains an string
 * https://stackoverflow.com/questions/6116474/how-to-find-if-an-array-contains-a-specific-string-in-javascript-jquery
 * @needle String to search for
 * @arrhaystack Array to search through
 * @return True if the object is in the array
 */
function arrayContains(needle, arrhaystack)
{
    return (arrhaystack.indexOf(needle) > -1);
}

/**
 * Test for blank or empty string
 * https://stackoverflow.com/questions/154059/how-can-i-check-for-an-empty-undefined-null-string-in-javascript
 * @str String or object
 * @return True if object is blank ("") or empty.
 */  
function isEmpty(str) {
    const is_empty = (!str || /^\s*$/.test(str));
    //console.log("isEmpty? " + is_empty);
    return is_empty;
  }
  
/**
 * Add schools to the dnd 5e list.
 * If the string of schools to add is empty, revert back. 
 * Remove any other than the default set or the new additions
 * @return Nothing
 */
async function addSpellSchools(init = false) {
  const schools_str = game.settings.get("spell-schools", "schools");
  //console.log("spell-schools | Settings: " + schools_str);
  //console.log("spell-schools | dnd_default_schools keys: " + Object.keys(dnd_default_schools));

  //console.log("spell-schools | default: ");
  //console.log(dnd_default_schools)
  
  let all_schools = game.dnd5e.config.spellSchools;
  if(!init) {
    // make sure we are deep copying and not linking.
    //console.log("spell-schools | all_schools keys: " + Object.keys(all_schools));

    all_schools = JSON.parse(JSON.stringify(all_schools));
    all_schools = filterObject(all_schools, dnd_default_schools);

    //console.log("spell-schools | all_schools keys: " + Object.keys(all_schools));

    // console.log(dnd_default_schools);

  }
  
  //console.log("spell-schools | all_schools object: ");
  //console.log(all_schools);

  
    
  if(!isEmpty(schools_str)) {
    console.log("spell-schools | Adding " + schools_str);
    const schools_to_add_arr = schools_str.split(",");
  
		// create keys and test each in turn
		schools_to_add_arr.forEach(function(sch) {
			const existing_keys = Object.keys( all_schools );
	
			// get the alphanumeric version
			const sch_key = sch.replace(/\W/g, '').toLowerCase();
		
			// check that we are not using an existing abbreviation
			if(!arrayContains(sch_key, existing_keys)) {
				all_schools[ sch_key ] = sch;  
				console.log("spell-schools | Added " + sch + " with key " + sch_key);;
			}
		});
  } else {
    console.log("spell-schools | Resetting to default 5e schools.");
  }
  
  console.log(all_schools);
  
  game.dnd5e.config.spellSchools = all_schools;
}
