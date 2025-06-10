class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

// class Location extends Scene {
//     create(key) {
//         let locationData = key; // TODO: use `key` to get the data object for the current story location
//         this.engine.show(this.engine.storyData.Locations[locationData].Body); // TODO: replace this text by the Body of the location data
//         if(this.engine.storyData.Locations[locationData].Choices) { // TODO: check if the location has any Choices
//             for(let choice of this.engine.storyData.Locations[locationData].Choices) { // TODO: loop over the location's Choices
//                 console.log(choice.Text);
//                 this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
//                 // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
//             }
//         } else {
//             this.engine.addChoice("The end.")
//         }
//     }

//     handleChoice(choice) {
//         if(choice) {
//             this.engine.show("&gt; "+choice.Text);
//             this.engine.gotoScene(Location, choice.Target);
//         } else {
//             this.engine.gotoScene(End);
//         }
//     }
// }

class Location extends Scene {
    create(locationKey) {
        this.locationKey = locationKey;
        const location = this.engine.storyData.Locations[locationKey];

        this.engine.setTitle(locationKey);
        this.engine.show(location.Body);

        console.log(location.TakesItem);

        // take item
        if (location.TakesItem) {
            if (!this.engine.inventory.has(location.TakesItem)) {
                this.engine.inventory.add(location.TakesItem);
                this.engine.show(`<em>You picked up: ${location.TakesItem}</em>`);
            }
        }

        // 🧭 Add choices (check if player has required item, if any)
        if (location.Choices) {
            for (let choice of location.Choices) {
                const required = choice.RequiresItem;
                if (!required || this.engine.inventory.has(required)) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}


class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
