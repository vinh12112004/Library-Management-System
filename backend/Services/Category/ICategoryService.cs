using backend.DTOs.Category;
using backend.DTOs.Shared;

namespace backend.Services.Category
{
    public interface ICategoryService
    {
        Task<PagedResult<CategoryDto>> GetAllCategoriesAsync(CategoryQuery query);
        Task<CategoryDto?> GetCategoryByIdAsync(int id);
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto);
        Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto);
        Task<bool> DeleteCategoryAsync(int id);
    }
}