type rewardDestination = "reward" | "category";

export class Reward {
  id: string;
  name: string;
  destination: rewardDestination;

  constructor(
    id: string = "",
    name: string = "",
    destination: rewardDestination = "reward"
  ) {
    this.id = id;
    this.name = name;
    this.destination = destination;
  }

  public static fromData(
    id: string,
    name: string,
    destination: rewardDestination
  ) {
    return new Reward(id, name, destination);
  }
}
