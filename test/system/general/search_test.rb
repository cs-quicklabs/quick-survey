require "application_system_test_case"

class SearchTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    sign_in @user
  end

  test "can search for anything" do
    visit dashboard_path(script_name: @account.id)
    within "nav.navbar" do
      fill_in "search", with: "a"
      assert_selector "li", text: "Aashish Dhawan"
    end
  end

  test "can search for projects" do
  end

  test "can not search deactivated employess" do
  end

  test "can not search archived projects" do
  end
end
