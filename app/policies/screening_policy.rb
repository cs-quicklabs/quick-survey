class ScreeningPolicy < Struct.new(:user, :screening)
  def index?
    return false if user.member?
    true
  end
end
