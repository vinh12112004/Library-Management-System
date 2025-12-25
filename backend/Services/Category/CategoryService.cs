using AutoMapper;
using backend.DTOs.Category;
using backend.DTOs.Shared;
using backend.Interfaces;

namespace backend.Services.Category
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<PagedResult<CategoryDto>> GetAllCategoriesAsync(CategoryQuery query)
        {
            var pagedCategories = await _categoryRepository.GetAllAsync(query);

            var dtoItems = pagedCategories.Items.Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                Name = c.Name,
                Description = c.Description
            }).ToList();

            return new PagedResult<CategoryDto>(
                dtoItems,
                pagedCategories.TotalCount,
                pagedCategories.PageNumber,
                pagedCategories.PageSize
            );

        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return category == null ? null : _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            var categoryModel = _mapper.Map<backend.Models.Category>(createCategoryDto);
            var newCategory = await _categoryRepository.AddAsync(categoryModel);
            return _mapper.Map<CategoryDto>(newCategory);
        }

        public async Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                return false;
            }

            _mapper.Map(updateCategoryDto, category);
            await _categoryRepository.UpdateAsync(category);

            return true;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                return false;
            }

            await _categoryRepository.DeleteAsync(id);
            return true;
        }
    }
}