using backend.DTOs.Dashboard;

namespace backend.Services.Dashboard;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardStatsAsync();
}