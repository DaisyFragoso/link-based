class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

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

        //  Add choices (check if player has required item, if any)
        if (location.Choices) {
            for (let choice of location.Choices) {
                const required = choice.Requires;
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
        // Check if the choice gives the player an item
        if (choice.TakesItem && !this.engine.inventory.has(choice.TakesItem)) {
            this.engine.inventory.add(choice.TakesItem);
            this.engine.show(`<em>You picked up: ${choice.TakesItem}</em>`);
        }

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
