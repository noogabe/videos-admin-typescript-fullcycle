import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  beforeEach(() => {
    Category.prototype.validate = jest
      .fn()
      .mockImplementation(Category.prototype.validate);
  });
  describe("constructor", () => {
    test("with default values ", () => {
      const category = new Category({ name: "Movie" });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("with all values ", () => {
      const category_id = new Uuid("7f104946-a32a-4288-9de1-b60b3cf1af67");
      const created_at = new Date();
      const category = new Category({
        category_id,
        name: "Movie",
        description: "Movie description",
        is_active: false,
        created_at,
      });
      expect(category.category_id).toEqual(category_id);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toEqual(created_at);
    });

    test("with name and description", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });
  describe("getters and setters", () => {
    test("entity_id", () => {
      const category_id = new Uuid("7f104946-a32a-4288-9de1-b60b3cf1af67");
      const category = new Category({ category_id, name: "Movie" });
      expect(category.entity_id).toBe(category_id);
    });
  });

  describe("create command", () => {
    test("should create a category", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    test("should create a category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "some description",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("some description");
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    test("should create a category with is_active", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });
  });

  describe("methods", () => {
    test("changeName", () => {
      const category = Category.create({ name: "Movie" });
      category.changeName("Other Movie");
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Other Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
    test("changeDescription", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie Description",
      });
      category.changeDescription("Other Description");
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Other Description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
    test("activate", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });
      expect(category.is_active).toBeFalsy();
      category.activate();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
    test("deactivate", () => {
      const category = Category.create({
        name: "Movie",
        is_active: true,
      });
      expect(category.is_active).toBeTruthy();
      category.deactivate();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
    test("toJSON", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie description",
      });
      expect(category.toJSON()).toEqual({
        category_id: category.category_id.id,
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        created_at: category.created_at,
      });
    });
  });
});
describe("Category Validator", () => {
  describe("create command", () => {
    test("invalid name", () => {
      const category = Category.create({ name: "t".repeat(256) });

      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    });
  });

  describe("changeName method", () => {
    it("should throw an error when name is invalid", () => {
      const category = Category.create({ name: "Movie" });
      category.changeName("t".repeat(256));
      expect(category.notification.hasErrors()).toBeTruthy();
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    });
  });
});
