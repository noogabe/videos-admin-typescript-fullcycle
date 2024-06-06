import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe("UpdateCategoryUseCase Integration Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });

  it("should throw error when entity is not found", async () => {
    const uuid = new Uuid();
    await expect(() =>
      useCase.execute({ id: uuid.id, name: "fake" })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it("should update a category", async () => {
    const entity = Category.fake().aCategory().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.category_id.id,
      name: "test",
    });
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: "test",
      description: entity.description,
      is_active: true,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          is_active: true,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          description: null,
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...(i.input.name && { name: i.input.name }),
        ...("description" in i.input && { description: i.input.description }),
        ...("is_active" in i.input && { is_active: i.input.is_active }),
      });
      const entityUpdated = await repository.findById(new Uuid(i.input.id));
      expect(output).toStrictEqual({
        id: entity.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: entityUpdated.created_at,
      });
      expect(entityUpdated.toJSON()).toStrictEqual({
        category_id: entity.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: entityUpdated.created_at,
      });
    }
  });
});
