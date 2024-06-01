require "application_system_test_case"

class SearchTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    sign_in @user
  end

  test "can search for spaces and surveys and folders" do
    visit dashboard_path(script_name: @account.id)
    within "nav.navbar" do
      fill_in "search", with: "p"
    end
    page.assert_selector(:css, "ul#results li")
    take_screenshot
  end

  test "can search for surveys" do
    visit surveys_path(script_name: @account.id)
    fill_in "survey-search", with: "project"
    page.assert_selector(:css, "ul#results li")
    take_screenshot
  end

  test "can not search deactivated users" do
    visit dashboard_path(script_name: @account.id)
    within "nav.navbar" do
      click_on "user-menu"
      click_on "Archive"
    end
    assert_selector "a", text: "Deactivated Users"
    click_on "Deactivated Users"
    fill_in "deactivated-user-search", with: "a"
    page.assert_selector(:css, "ul#results li")
    take_screenshot
  end

  test "can not search archived surveys" do
    visit dashboard_path(script_name: @account.id)
    within "nav.navbar" do
      click_on "user-menu"
      click_on "Archive"
    end
    assert_selector "a", text: "Archived Surveys"
    click_on "Archived Surveys"
    fill_in "archived-survey-search", with: "a"
    page.assert_selector(:css, "ul#results li")
    take_screenshot
  end

  test "super admin can search for anything" do
    login_as users(:super_admin)
    visit dashboard_path(script_name: @account.id)
    within "nav.navbar" do
      fill_in "search", with: "P"
    end
    page.assert_selector(:css, "ul#results li")
    take_screenshot
  end

  test "super admin can search for surveys" do
    login_as users(:super_admin)
    visit surveys_path(script_name: @account.id)
    fill_in "survey-search", with: "project"
    page.assert_selector(:css, "ul#results li")
    take_screenshot
  end

  test "super admin can not search deactivated users" do
    login_as users(:super_admin)
    visit dashboard_path(script_name: @account.id)
    within "nav.navbar" do
      click_on "user-menu"
      click_on "Archive"
    end
    assert_selector "a", text: "Deactivated Users"
    click_on "Deactivated Users"
    fill_in "deactivated-user-search", with: "a"
    page.assert_selector(:css, "ul#results li")
    take_screenshot
  end

  test "super admin can not search archived surveys" do
    login_as users(:super_admin)
    visit dashboard_path(script_name: @account.id)
    within "nav.navbar" do
      click_on "user-menu"
      click_on "Archive"
    end
    assert_selector "a", text: "Archived Surveys"
    click_on "Archived Surveys"
    fill_in "archived-survey-search", with: "a"
    page.assert_selector(:css, "ul#results li")
    take_screenshot
  end

  test "member can not search for anything" do
    login_as users(:member)
    visit dashboard_path(script_name: @account.id)
    within "nav.navbar" do
      assert_no_selector "input#search"
    end
    take_screenshot
  end
end
