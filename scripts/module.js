Hooks.once('init', setup);

var dnd_default_schools = {};

Hooks.once('ready', async function() {
  dnd_default_schools = game.dnd5e.config.spellSchools;
  await addSpellSchools();
});

async function setup() {
    console.log('spell-schools | Initializing Spell Schools module');
    await registerSpellSchoolsSettings();
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
async function addSpellSchools() {
  const schools_str = game.settings.get("spell-schools", "schools");
  let all_schools = dnd_default_schools;
  
  if(!isEmpty(schools_str)) {
    console.log("spell-schools | Adding " + schools_str);
    const schools_to_add_arr = schools_str.split(",");
  
		// create abbreviations and test each in turn
		schools_to_add_arr.forEach(function(sch) {
			const existing_abbr = Object.keys( all_schools );
	
			// get the alphanumeric version
			const sch_alpha = sch.replace(/\W/g, '').toLowerCase();
		
			let i = Math.min(3, sch_alpha.length);
			let sch_abbr = sch_alpha.substring(0, i - 1);
			while(i < sch_alpha.length && arrayContains(sch_abbr, existing_abbr)) {
				// test increasingly long abbreviations until we get one that works
				i += 1;
				sch_abbr = sch_alpha.substring(0, i - 1);
			}
		
			// check that we are not still using an existing abbreviation
			if(!arrayContains(sch_abbr, existing_abbr)) {
				all_schools[ sch_abbr ] = sch;  
				console.log("spell-schools | Added " + sch + " with abbreviation " + sch_abbr);;
			}
		});
  }
  
  game.dnd5e.config.spellSchools = all_schools;
}