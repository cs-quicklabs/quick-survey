class DashboardPolicy < Struct.new(:user, :home)
  def index?
    true
  end
end
